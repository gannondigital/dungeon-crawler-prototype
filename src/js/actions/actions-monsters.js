import { monsterService } from "../services/service-monsters";
import { dispatcher } from "../lib/game-dispatcher";
import * as constants from "../config/constants-actions.json";

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
