import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class ItemStore extends Store {

  constructor() {
    super();
    this.data = {
      items: {
        weapons: [
  
        ],
        armor: [

        ],
        items: [

        ]
      },
      itemsByName: {
        
      },
      levelName: "none"
    };
  }

  getItems(itemNames) {
    if (!itemNames || typeof itemNames !== 'object' || !itemNames.length) {
      throw new TypeError('Invalid itemNames passed to getItems');
    }

    const itemsArr = itemNames.map((itemName) => {
      const item = this.data.itemsByName[itemName];
      if (!item) {
        console.log(`Could not find item ${itemName} in itemsStore`);
        return null;
      }

      return item;
    });

    const justItems = itemsArr.filter((item) => {
      return !!item;
    });

    return justItems;
  }

}

export const itemsStore = new ItemStore();
itemsStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.ITEMS_LOADED:
      const oldLevel = itemsStore.data.levelName;
      itemsStore.data.levelName = action.payload.levelName;

      itemsStore.triggerChange();

      break;
    default:
      break;
  }
});
