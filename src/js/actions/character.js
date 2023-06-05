import { dispatcher } from "../lib/game-dispatcher";
import levelStore from "../stores/level";
import { startCombat } from "../actions/combat";
import { CHARACTER } from "../constants";
import { DIRECTION_SET, TILE_SET } from "../constants/actions";

export const setDirection = (dir) => {
  if (!dir || typeof dir !== "string") {
    console.log("invalid direction passed to setDirection");
    return;
  }
  dispatcher.dispatch({
    type: DIRECTION_SET,
    payload: {
      direction: dir,
    },
  });
};

/**
 * Takes name of tile, pulls tile from level data, and dispatches the tile
 * @param {String} tileName Name of tile
 */
export const setTile = (tileName) => {
  // @todo for consistency, this should probably call TileFactory,
  // which would pull the tile data from the level store
  const tile = levelStore.getTile(tileName);

  dispatcher.dispatch({
    type: TILE_SET,
    payload: { tile },
  });
};
