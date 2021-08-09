import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import * as constants from "../config/constants-actions";
import ItemFactory from "../lib/item-factory";

class ItemStore extends Store {
  constructor() {
    super();
    this.data = {
      items: {
        weapons: [],
        armor: [],
        items: []
      },
      itemsByName: {},
      levelName: "none"
    };
  }

  /**
   * @param  {Array} itemNames Array of item 'name' fields
   * @return {Array}           Array of Item objects
   */
  getItems(itemNames) {
    if (!itemNames || typeof itemNames !== "object" || !itemNames.length) {
      throw new TypeError("Invalid itemNames passed to getItems");
    }

    const itemsArr = itemNames.map(itemName => {
      const item = this.data.itemsByName[itemName];
      if (!item) {
        console.log(this);
        throw new ReferenceError(
          `Could not find item ${itemName} in itemsStore`
        );
      }

      return item;
    });

    const justItems = itemsArr.filter(item => {
      return !!item;
    });

    const itemObjs = justItems.map(itemData => {
      return ItemFactory(itemData);
    });

    return itemObjs;
  }
}

export const itemsStore = new ItemStore();
itemsStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case constants.ITEMS_LOADED:
      const oldLevel = itemsStore.data.levelName;
      const newLevel = action.payload.levelName;

      if (oldLevel === newLevel) {
        return;
      }
      itemsStore.data.levelName = newLevel;
      itemsStore.data.itemsByName = action.payload.items;

      itemsStore.triggerChange();
      break;
    default:
      break;
  }
});
