import Item from "../models/item";
import Weapon from "../models/weapon";
import Armor from "../models/armor";

/**
 * Instantiates a Weapon, Armor, or Item based on item type.
 * @param  {Object} itemProps Monster data, from store/level data
 * @return {Monster}              Instance of Monster model
 */
export const ItemFactory = itemProps => {
  const itemRoles = itemProps.itemRoles;
  if (itemRoles.indexOf("weapon") !== -1) {
    return new Weapon(itemProps);
  }
  if (itemRoles.indexOf("armor") !== -1) {
    return new Armor(itemProps);
  }

  return new Item(itemProps);
};

export default ItemFactory;
