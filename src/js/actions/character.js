import { dispatcher } from "../lib/game-dispatcher";
import { DIRECTION_SET, TILE_SET } from "../constants/actions";

export const setDirection = (direction) => {
  if (!direction || typeof direction !== "string") {
    throw new TypeError("invalid direction passed to setDirection");
  }

  dispatcher.dispatch({
    type: DIRECTION_SET,
    payload: {
      direction,
    },
  });
};

/**
 * Takes name of tile, pulls tile from level data, and dispatches the tile
 * @param {String} tileName Name of tile
 */
export const setTile = (tileName) => {
  dispatcher.dispatch({
    type: TILE_SET,
    payload: { tileName },
  });
};
