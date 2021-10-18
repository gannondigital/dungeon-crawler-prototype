import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { TileFactory } from "../lib/tile-factory";
import {
  startDirection,
  startTileName
} from "../config/default.json";
import { LEVEL_LOADED } from "../constants/actions";

class LevelStore extends Store {
  constructor() {
    super();
    this.data = {
      levelName: null,
      startDirection,
      startTileName,
      // @todo maybe this should be null til we load the data?
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

    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  handleAction = ({ type, payload }) => {
    switch (type) {
      case LEVEL_LOADED:
        const { levelName, tiles} = payload;

        if (this.data.levelName !== levelName) {
          this.data = {
            ...this.data,
            levelName,
            tiles
          };
          this.triggerChange();
        }

      default:
        break;
    }
  };

  getLevelName() {
    return this.data.levelName;
  }

  getTile(tileName) {
    if (!tileName || typeof tileName !== "string") {
      throw new TypeError("invalid tileName passed to getTile.");
    }

    const tile = this.data.tiles[tileName];
    if (typeof tile === "undefined") {
      throw new ReferenceError(`Could not find tile ${tileName}`);
    }

    // @todo this cloning should be more deliberate and consistent.
    // Decide where we have an airgap and where we explicitly don't
    return TileFactory(cloneDeep(tile));
  }
}

const levelStore = new LevelStore();
export default levelStore;
