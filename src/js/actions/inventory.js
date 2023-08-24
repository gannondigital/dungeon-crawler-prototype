import { dispatcher } from "../lib/game-dispatcher";
import {
  INVENTORY_ADD_ITEMS,
  INVENTORY_SET_ACTIVE_WEAPON,
  INVENTORY_SET_ACTIVE_ARMOR,
} from "../constants/actions";

/**
 * @param {Array} items Array of Item instances
 */
export const addToInventory = (items) => {
  dispatcher.dispatch({
    type: INVENTORY_ADD_ITEMS,
    payload: {
      items,
    },
  });
};

/**
 * @param {String} weaponName
 */
export const setActiveWeapon = (weaponName) => {
  dispatcher.dispatch({
    type: INVENTORY_SET_ACTIVE_WEAPON,
    payload: {
      weaponName,
    },
  });
};

/**
 * @param {String} armorName
 */
export const setActiveArmor = (armorName) => {
  dispatcher.dispatch({
    type: INVENTORY_SET_ACTIVE_ARMOR,
    payload: {
      armorName,
    },
  });
};
