import levelService from "../services/level";
import { dispatcher } from "../lib/game-dispatcher";
import { LEVEL_LOADED } from "../constants/actions";

/**
 * Gets level data from level service, dispatches it
 * @param {String} levelName e.g. "one"
 */
export const loadLevel = async (levelName) => {
  if (!levelName || typeof levelName !== "string") {
    throw new TypeError("Invalid levelName passed to loadLevel");
  }

  const { name, tiles } = await levelService.getLevel(levelName);
  dispatcher.dispatch({
    type: LEVEL_LOADED,
    payload: {
      levelName: name,
      tiles,
    },
  });
};
