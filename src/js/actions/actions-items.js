import { itemsService } from '../services/service-items';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';

export const loadItems = (levelName) => {
  return new Promise((resolve, reject) => {
    if (!levelName || typeof levelName !== 'string') {
      throw new TypeError('Invalid levelName passed to loadLevel');
    }

    itemsService.getItems(levelName).then((items) => {
      dispatcher.dispatch({
        type: constants.ITEMS_LOADED,
        payload: {
          levelName: levelName,
          items
        }
      });
      resolve();
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};