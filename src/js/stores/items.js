import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { ITEMS_LOADED } from "../constants/actions";

/**
 * Data stores that are populated at load time and seldom
 * change afterward are not well suited to the flux-y store
 * pattern, but for now still implemented that way
 *
 * This could potentially be folded into the ItemsService?
 */
class ItemStore extends Store {
  constructor() {
    super();
    this.data = {
      items: {
        weapons: [],
        armor: [],
        items: [],
      },
      itemsByName: {},
      levelName: "",
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  handleAction = (action) => {
    const { type, payload } = action;

    switch (type) {
      // @todo validate
      case ITEMS_LOADED:
        if (this.data.levelName === payload.levelName) {
          return;
        }
        this.data.levelName = payload.levelName;
        this.data.itemsByName = payload.items;

        this.triggerChange();
        break;
      default:
        break;
    }
  };

  /**
   * @todo do we actually need this array behavior anywhere?
   * @param  {Array<String>} itemNames Array of item 'name' fields
   * @return {Array<Object>}           Array of item data objects
   */
  getItems(itemNames) {
    if (!Array.isArray(itemNames) || itemNames.length === 0) {
      throw new TypeError("Invalid itemNames passed to getItems");
    }

    return itemNames
      .map((itemName) => {
        const item = this.data.itemsByName[itemName];
        if (!item) {
          throw new ReferenceError(
            `Could not find item ${itemName} in itemsStore`
          );
        }
        return item;
      })
      .filter((item) => {
        return !!item;
      });
  }

  /**
   *
   * @param {String} itemName
   * @returns {Object} item data
   */
  getItemData(itemName) {
    return this.getItems([itemName])[0];
  }
}

const itemsStore = new ItemStore();
export default itemsStore;
