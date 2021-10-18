import monsterService from "../services/monsters";
import { dispatcher } from "../lib/game-dispatcher";
import { MONSTERS_LOADED } from "../constants/actions";

/**
 * loads monster data from monsters service, and dispatches it
 * @param {String} levelName e.g., 'one'
 */
export const loadMonsters = async levelName => {
  if (!levelName || typeof levelName !== "string") {
    throw new TypeError("Invalid levelName passed to loadMonsters");
  }

  const { monsters } = await monsterService.getMonsters(levelName);
  dispatcher.dispatch({
    type: MONSTERS_LOADED,
    payload: {
      levelName,
      monsters
    }
  });
};
