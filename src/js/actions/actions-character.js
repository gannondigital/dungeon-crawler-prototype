
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';
import { levelStore } from '../stores/store-level';
import { startCombat } from '../actions/actions-combat';

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
  const tile = levelStore.getTile(tileName);

  const monsters = tile.getMonsters();
  if (monsters.length) {
    startCombat(monsters);
  }

  dispatcher.dispatch({
    type: constants.TILE_SET,
    payload: { tileName }
  });
};