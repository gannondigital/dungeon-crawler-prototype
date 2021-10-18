import { dispatcher } from "../lib/game-dispatcher";
import levelStore from "../stores/level";
import { startCombat } from "../actions/combat";
import constants from "../constants";
import actionConstants from "../constants/actions";

const { DIRECTION_SET, TILE_SET } = actionConstants;
const { CHARACTER } = constants;

export const setDirection = dir => {
  if (!dir || typeof dir !== "string") {
    console.log("invalid direction passed to setDirection");
    return;
  }
  dispatcher.dispatch({
    type: DIRECTION_SET,
    payload: {
      direction: dir
    }
  });
};

export const setTile = tileName => {
  const tile = levelStore.getTile(tileName);

  dispatcher.dispatch({
    type: TILE_SET,
    payload: { tile }
  });
};
