
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';

export const setTile = (tile) => {
	dispatcher.dispatch({
		type: constants.TILE_SET,
		payload: { tile }
  });
};
