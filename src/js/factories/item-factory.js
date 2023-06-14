import Item from "../models/item";
import Weapon from "../models/weapon";
import Armor from "../models/armor";
import itemsStore from "../stores/items";

/**
 * @todo kind of like the idea of unique items being singletons
 *       if you can only own 1 XYZ at a time, then every attempt
 *       to create item XYZ should return the same reference(?)`
 * Instantiates a Weapon, Armor, or Item based on item type. Responsible
 * for business context of item creation
 * This is called in a store's getter, and it calls a getter from
 * the item store itself, which is weird but not unlike a complex
 * reducer. Ok with it for now; besides, there's no good reason for
 * level data to be in a store, as it is all effectively constant
 * @param  {String} itemName  Name of item
 * @return {Item|Weapon|Armor}       Instance of appropriate Item class
 */
export const ItemFactory = (itemName) => {
  // @todo level data, e.g. items, should not live in stores,
  // and this should not be a store lookup
  const itemData = itemsStore.getItemData(itemName);
  const { itemRoles } = itemData;
  if (itemRoles.includes("weapon")) {
    return new Weapon(itemData);
  }
  if (itemRoles.includes("armor")) {
    return new Armor(itemData);
  }
  return new Item(itemData);
};

export default ItemFactory;
