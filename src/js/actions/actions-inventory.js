import { dispatcher } from "../lib/game-dispatcher";
import {
  INVENTORY_ADD_ITEMS,
  INVENTORY_SET_ACTIVE_WEAPON,
  INVENTORY_SET_ACTIVE_ARMOR
} from "../config/constants-actions";

export const addToInventory = itemsArr => {
  dispatcher.dispatch({
    type: INVENTORY_ADD_ITEMS,
    payload: {
      items: itemsArr
    }
  });
};

export const setActiveWeapon = weapon => {
  dispatcher.dispatch({
    type: INVENTORY_SET_ACTIVE_WEAPON,
    payload: {
      weapon
    }
  });
};

export const setActiveArmor = armor => {
  dispatcher.dispatch({
    type: INVENTORY_SET_ACTIVE_ARMOR,
    payload: {
      armor
    }
  });
};
