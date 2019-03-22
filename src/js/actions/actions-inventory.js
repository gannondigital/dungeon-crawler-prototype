import { dispatcher } from '../lib/game-dispatcher';
import { INVENTORY_ADD_ITEMS } from "../config/constants-actions";

export const addToInventory = (itemsArr) => {
  dispatcher.dispatch({
    type: INVENTORY_ADD_ITEMS,
    payload: {
      items: itemsArr
    }
  });
}