import cloneDeep from "lodash.cloneDeep";

import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

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
    return cloneDeep(this.data.items);
  }

}

export const inventoryStore = new InventoryStore();
inventoryStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.INVENTORY_ADD_ITEMS:
      const { items } = action.payload;
      const sortedItems = sortItems(items);
      Object.keys(sortedItems).forEach((itemCategory) => {
        inventoryStore.data.items[itemCategory] = inventoryStore.data.items[itemCategory].concat(sortedItems[itemCategory]);
      });
      break;
    default:
      break;
  }
});

function sortItems(itemsArr) {
  const weaponsToAdd = [];
  const armorToAdd = [];
  const itemsToAdd = [];

  return itemsArr.reduce( (sortedItems, item) => {
    const roles = item.getRoles();
    if (roles.indexOf('weapon') !== -1) {
      sortedItems.weapons.push(item)
    }else if (roles.indexOf('armor') !== -1) {
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
