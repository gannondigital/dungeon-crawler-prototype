import { dispatcher } from "../lib/game-dispatcher";
import levelStore from "../stores/level";
import { startCombat } from "../actions/combat";
import { CHARACTER } from "../constants";
import { DIRECTION_SET, TILE_SET } from "../constants/actions";

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
