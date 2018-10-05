
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';

export const setDirection = (dir) => {
  if (!dir || typeof dir !== 'string') {
    console.log('invalid direction passed to setDirection');
    return;
  }
  dispatcher.dispatch({
    type: constants.DIRECTION_SET,
    payload: {
      direction: dir
    }
  });
};

export const setTile = (tileName) => {
  dispatcher.dispatch({
    type: constants.TILE_SET,
    payload: { tileName }
  });
};