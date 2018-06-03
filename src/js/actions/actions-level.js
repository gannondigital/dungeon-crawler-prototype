
import { levelService } from '../services/service-level';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';

export const loadLevel = (levelName) => {
  return new Promise((resolve, reject) => {
    if (!levelName || typeof levelName !== 'string') {
      throw new TypeError('Invalid levelName passed to loadLevel');
    }

    levelService.getLevel(levelName).then((level) => {
      dispatcher.dispatch({
        type: constants.LEVEL_LOADED,
        payload: {
          levelName: level.levelName,
          tiles: level.tiles
        }
      });
      resolve();
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });

};
