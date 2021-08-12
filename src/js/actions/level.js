import levelService from "../services/level";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

export const loadLevel = levelName => {
  return new Promise((resolve, reject) => {
    if (!levelName || typeof levelName !== "string") {
      throw new TypeError("Invalid levelName passed to loadLevel");
    }

    levelService
      .getLevel(levelName)
      .then(level => {
        dispatcher.dispatch({
          type: constants.LEVEL_LOADED,
          payload: {
            levelName: level.levelName,
            tiles: level.tiles
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
