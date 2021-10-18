import { dispatcher } from "../lib/game-dispatcher";
import actionConstants from "../constants/actions";

const {
  INVENTORY_ADD_ITEMS,
  INVENTORY_SET_ACTIVE_WEAPON,
  INVENTORY_SET_ACTIVE_ARMOR
} = actionConstants;

/**
 * @param {Array} itemNames Array of item name strings
 */
export const addToInventory = itemNames => {
  dispatcher.dispatch({
    type: INVENTORY_ADD_ITEMS,
    payload: {
      items: itemNames
    }
  });
};

/**
 * @param {String} weaponName 
 */
export const setActiveWeapon = weaponName => {
  dispatcher.dispatch({
    type: INVENTORY_SET_ACTIVE_WEAPON,
    payload: {
      weaponName
    }
  });
};

/**
 * @param {String} armorName 
 */
export const setActiveArmor = armorName => {
  dispatcher.dispatch({
    type: INVENTORY_SET_ACTIVE_ARMOR,
    payload: {
      armorName
    }
  });
};
