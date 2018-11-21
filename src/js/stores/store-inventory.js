
import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class InventoryStore extends Store {

  constructor() {
    super();
    this.data = {
      activeWeapon: null,
      items: {},
      // mocks
      weapons: {
        'stick': {
          dmg: 1
        }
      },
    };
  }

}

export const inventoryStore = new InventoryStore();
inventoryStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.INVENTORY_ADD_ITEMS:
      

      break;
    default:
      break;
  }
});
