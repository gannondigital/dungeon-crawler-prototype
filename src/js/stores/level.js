import isEqual from "lodash.isEqual";
import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";
import { TileFactory } from "../lib/tile-factory";
import Tile from "../models/tile";

class LevelStore extends Store {
  constructor() {
    super();
    this.data = {
      levelName: "none",
      startDirection: "n",
      startTileName: "1x1",
      tiles: {
        "tile-1": {
          walls: {
            n: {},
            e: {},
            s: {},
            w: {}
          }
        }
      }
    };
  }

  getLevelName() {
    return this.data.levelName;
  }

  getStartTilename() {
    return this.data.startTileName;
  }

  getTile(tileName) {
    if (!tileName || typeof tileName !== "string") {
      throw new TypeError("invalid tileName passed to getTile.");
    }

    const tile = this.data.tiles[tileName];
    if (typeof tile === "undefined") {
      throw new ReferenceError(`Could not find tile ${tileName}`);
    }

    // return new Tile(cloneDeep(tile));
    return TileFactory(cloneDeep(tile));
  }
}

const levelStore = new LevelStore();
levelStore.dispatchToken = dispatcher.register(action => {
  let levelName;
  let newLevel;

  switch (action.type) {
    case constants.LEVEL_LOADED:
      const oldLevel = levelStore.data.levelName;
      levelStore.data.levelName = action.payload.levelName;

      // is this really more expensive than loading Immutable and wrestling with it throughout?
      // prolly not
      if (!isEqual(oldLevel, levelStore.data.levelName)) {
        levelStore.data.tiles = action.payload.tiles;
        //this.startTileName =
        levelStore.triggerChange();
      }
      break;
    default:
      break;
  }
});

export default levelStore;
