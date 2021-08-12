import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

import ItemFactory from "../lib/item-factory";
import Weapon from "../models/weapon";
import Armor from "../models/armor";

function sortItems(itemInstances) {
  const weaponsToAdd = [];
  const armorToAdd = [];
  const itemsToAdd = [];

  return itemInstances.reduce(
    (sortedItems, item) => {
      if (item instanceof Weapon) {
        sortedItems.weapons.push(item);
      } else if (item instanceof Armor) {
        sortedItems.armor.push(item);
      } else {
        sortedItems.items.push(item);
      }
      return sortedItems;
    },
    {
      weapons: [],
      armor: [],
      items: []
    }
  );
}

class InventoryStore extends Store {
  constructor() {
    super();
    this.data = {
      activeWeapon: null,
      activeArmor: null,
      items: {
        weapons: [],
        armor: [],
        items: []
      }
    };
  }

  getAllItems() {
    return this.data.items;
  }

  getActiveWeapon() {
    return this.data.activeWeapon;
  }

  getActiveArmor() {
    return this.data.activeArmor;
  }
}

const inventoryStore = new InventoryStore();
inventoryStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    // @todo support items that you can have multiples of
    case constants.INVENTORY_ADD_ITEMS:
      const { items } = action.payload;
      const sortedItems = sortItems(items);
      Object.keys(sortedItems).forEach(itemCategory => {
        inventoryStore.data.items[itemCategory] = inventoryStore.data.items[
          itemCategory
        ].concat(sortedItems[itemCategory]);
      });
      break;
    case constants.INVENTORY_SET_ACTIVE_WEAPON:
      const { weapon } = action.payload;
      inventoryStore.data.activeWeapon = weapon;
    case constants.INVENTORY_SET_ACTIVE_ARMOR:
      const { armor } = action.payload;
      inventoryStore.data.activeArmor = armor;
    default:
      break;
  }
});

export default inventoryStore;
