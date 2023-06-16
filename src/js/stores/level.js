import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { TileFactory } from "../factories/tile-factory";
import config from "../config/default.json";
import { LEVEL_LOADED } from "../constants/actions";
const { startDirection, startTileName } = config;

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
            w: {},
          },
        },
      },
    };

    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  handleAction = ({ type, payload }) => {
    switch (type) {
      case LEVEL_LOADED:
        const { levelName, tiles } = payload;

        if (this.data.levelName !== levelName) {
          this.data = {
            ...this.data,
            levelName,
            tiles,
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

  getTileData(tileName) {
    if (!tileName || typeof tileName !== "string") {
      throw new TypeError("invalid tileName passed to getTileData.");
    }

    const tile = this.data.tiles[tileName];
    if (typeof tile === "undefined") {
      throw new ReferenceError(`Could not find tile ${tileName}`);
    }

    return cloneDeep(tile);
  }
}

const levelStore = new LevelStore();
export default levelStore;
