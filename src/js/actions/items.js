import itemsService  from "../services/items";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

export const loadItems = levelName => {
  return new Promise((resolve, reject) => {
    if (!levelName || typeof levelName !== "string") {
      throw new TypeError("Invalid levelName passed to loadLevel");
    }

    itemsService
      .getItems(levelName)
      .then(items => {
        dispatcher.dispatch({
          type: constants.ITEMS_LOADED,
          payload: {
            levelName: levelName,
            items
          }
        });
        resolve();
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
