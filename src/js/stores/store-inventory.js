import cloneDeep from "lodash.cloneDeep";

import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

import ItemFactory from '../lib/item-factory';
import Weapon from '../models/model-weapon';
import Armor from '../models/model-armor';

class InventoryStore extends Store {

  constructor() {
    super();
    this.data = {
      activeWeapon: null,
      items: {
        weapons: [
          {
            'stick': {
              dmg: 1
            }
          },
        ],
        armor: [

        ],
        items: [

        ]
      }
    };
  }

  getAllItems() {
    return this.data.items;
  }

  getActiveWeapon() {
    return this.data.activeWeapon;
  }

}

export const inventoryStore = new InventoryStore();
inventoryStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.INVENTORY_ADD_ITEMS:
      const { items } = action.payload;
      const itemInstances = items.forEach((itemProps) => {
        return ItemFactory(itemProps);
      });
      const sortedItems = sortItems(itemInstances);
      Object.keys(sortedItems).forEach((itemCategory) => {
        inventoryStore.data.items[itemCategory] = inventoryStore.data.items[itemCategory].concat(sortedItems[itemCategory]);
      });
      break;
    case constants.INVENTORY_SET_ACTIVE_WEAPON:
      const { weapon } = action.payload;
      inventoryStore.data.activeWeapon = weapon;
    default:
      break;
  }
});

function sortItems(itemInstances) {
  const weaponsToAdd = [];
  const armorToAdd = [];
  const itemsToAdd = [];

  return itemsArr.reduce( (sortedItems, item) => {
    
    if (item instanceof Weapon) {
      sortedItems.weapons.push(item)
    }else if (item instanceof Armor) {
      sortedItems.armor.push(item);
    } else {
      sortedItems.items.push(item);
    }
    return sortedItems;
  }, {
    weapons: [],
    armor: [],
    items: []
  } );
}
