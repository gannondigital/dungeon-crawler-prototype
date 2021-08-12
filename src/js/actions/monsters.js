import monsterService from "../services/monsters";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

export const loadMonsters = levelName => {
  return new Promise((resolve, reject) => {
    if (!levelName || typeof levelName !== "string") {
      throw new TypeError("Invalid levelName passed to loadMonsters");
    }

    monsterService
      .getMonsters(levelName)
      .then(monsters => {
        dispatcher.dispatch({
          type: constants.MONSTERS_LOADED,
          payload: {
            levelName: levelName,
            monsters: monsters
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