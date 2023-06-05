import itemsService from "../services/items";
import { dispatcher } from "../lib/game-dispatcher";
import { ITEMS_LOADED } from "../constants/actions";

/**
 * Loads the level's items from level service, and dispatches them
 * @todo support character having an existing item that is not in the
 *        level data
 * @param {String} levelName
 */
export const loadItems = async (levelName) => {
  if (!levelName || typeof levelName !== "string") {
    throw new TypeError("Invalid levelName passed to loadLevel");
  }

  const items = await itemsService.getItems(levelName);
  // @todo this should probably be an action creator but really data
  // like this doesn't need to go through flux or be in stores, so...
  dispatcher.dispatch({
    type: ITEMS_LOADED,
    payload: {
      levelName,
      items,
    },
  });
};
