import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import itemsStore from "./items";
import ItemFactory from "../lib/item-factory";
import {
  INVENTORY_ADD_ITEMS,
  INVENTORY_SET_ACTIVE_ARMOR,
  INVENTORY_SET_ACTIVE_WEAPON,
  ITEMS_LOADED
} from "../constants/actions";

import Weapon from "../models/weapon";
import Armor from "../models/armor";

// stores could alternately be exposed as factories, with the app
// creating instances of them at boot time and exposing those instances 
// to components of the app via react context etc. Then we could do 
// a bunch of dependency injection.
// But that's a lot of overhead I really don't need, when the native 
// js module pattern gives me the features of a singleton that I want.
// I can live without dependency injection right now
import config from "../config/default";
const {
  startingArmor,
  startingWeapon
} = config;

// @todo use constants for static keys, e.g. armor, weapons?

/**
 * this is pretty hardcode-y, but it doesn't need to be all purpose
 * @param {[Item|Weapon|Armor]} itemInstances  
 * @returns {Object}  Object keyed by item type, where each
 *                    value is an array of item names
 */
function sortItemsByType(itemInstances) {
  return itemInstances.reduce(
    (sortedItems, item) => {
      const { meta: { name } } = item;
      const { weapons, armor, items } = sortedItems;
      
      if (item instanceof Weapon) {
        weapons.push(name);
      } else if (item instanceof Armor) {
        armor.push(name);
      } else {
        items.push(name);
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
    // @todo get from saved data or fall back to 
    // these defaults
    // @todo make this data more meaningful, e.g. what is indicated
    // by order of an item within an array, support sorting, etc.
    // but let's see what we want that to look like first
    this.data = {
      initialized: false,
      activeWeapon: null,
      activeArmor: null,
      items: {
        weapons: [],
        armor: [],
        // @todo are there any starting items? should support em
        items: []
      }
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  /**
   * @param {Object} action SFO
   * @param {String} action.type
   * @param {Object} action.payload
   * @param {Array} action.payload.items Array of item name strings
   */
  handleAction = (action) => {
    const {
      type,
      payload
    } = action;

    switch (type) {
      case ITEMS_LOADED:
        // @todo this data will some day not be in a store
        // and this dependency will change
        dispatcher.waitFor([itemsStore.dispatchToken]);

        if (this.data.initialized) {
          throw new Error('Initialized inventory store re-initializing');
        }
        const initialArmor = ItemFactory(startingArmor);
        const initialWeapon = ItemFactory(startingWeapon);
        this.data = {
          ...this.data,
          activeArmor: initialArmor,
          activeWeapon: initialWeapon,
          items: {
            weapons: [initialWeapon],
            armor: [initialArmor],
            items: []
          },
          initialized: true
        };
      case INVENTORY_ADD_ITEMS:
        const { items: itemsByName } = payload;
        // reconstituting the items here ensures the store
        // doesn't hold on to unexpected references
        // @todo review & be deliberate
        const items = Object.keys(itemsByName).map(ItemFactory);

        const itemsByCategory = sortItemsByType(items);
        // @todo probably want a Set here for unique items
        // @todo consolidate items that you can have multiples of
        // @todo dedupe item references in case same item is added twice
        Object.keys(itemsByCategory).forEach(itemCategory => {
          this.data.items[itemCategory] = this.data.items[
            itemCategory
          ].concat(itemsByCategory[itemCategory]);
        });
        break;
      // @todo validate
      case INVENTORY_SET_ACTIVE_WEAPON:
        const { weaponName } = payload;
        this.data.activeWeapon = ItemFactory(weaponName);
      // @todo validate
      case INVENTORY_SET_ACTIVE_ARMOR:
        const { armorName } = payload;
        this.data.activeArmor = ItemFactory(armorName);
      default:
        break;
    }
  }

  /**
   * yep, shared references. you pull an object from this store,
   * you've got the same object the rest of the app does, so 
   * act like it
   * @returns {Object} An object with keys for armor, weapons,
   *                          and items; each is an array of 
   *                          Items (or its subclasses)
   * 
   */
  getFullInventory() {
    return this.data.items;
  }

  /**
   * @returns {Item|Weapon|Armor} Currently equipped weapon
   */
  getActiveWeapon() {
    return this.data.activeWeapon;
  }

  /**
   * @returns {Item|Weapon|Armor} Currently equipped armor
   */
  getActiveArmor() {
    return this.data.activeArmor;
  }
}

const inventoryStore = new InventoryStore();
export default inventoryStore;
