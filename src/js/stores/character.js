import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import {
  TILE_SET,
  DIRECTION_SET,
  COMBAT_DAMAGE_CHARACTER,
} from "../constants/actions";
import { TileFactory } from "../factories/tile-factory";

class CharacterStore extends Store {
  // @todo populate initial state from game config
  constructor() {
    super();
    this.data = {
      currLevel: "one",
      currTileName: "1x1",
      currDirection: "s",
      health: 0,
      attributes: {
        accuracy: 1,
        dex: 0,
        str: 1,
        intelligence: 0,
        stamina: 0,
      },
      expLevel: 1,
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  handleAction = (action) => {
    const { type, payload } = action;

    switch (type) {
      case TILE_SET:
        const { tileName } = payload;
        const tile = TileFactory(tileName);
        const newTileName = tile.getName();
        if (this.data.currTileName !== newTileName) {
          this.data.currTileName = newTileName;
          this.triggerChange();
        }
        break;

      case DIRECTION_SET:
        const { direction } = payload;
        if (this.data.currDirection !== direction) {
          this.data.currDirection = direction;
          this.triggerChange();
        }
        break;

      case COMBAT_DAMAGE_CHARACTER:
        const { dmg } = payload;
        const {
          data: { health },
        } = this;
        this.data.health = health - dmg;
        // @todo handle character "death"
        if (this.data.health <= 0) {
          console.log("zero health!");
        }
        this.triggerChange();
        break;

      default:
        break;
    }
  };

  // @todo should this be getCurrDirection?
  getDirection() {
    return this.data.currDirection;
  }

  getCurrTileName() {
    return this.data.currTileName;
  }

  getAccuracy() {
    return this.data.attributes.accuracy;
  }

  // @todo why is str abbreviated, but not intelligence :P
  getStr() {
    return this.data.attributes.str;
  }

  getIntVal() {
    return this.data.attributes.intelligence;
  }

  // @todo why evasion when the attribute is dex?
  getEvasion() {
    return this.data.attributes.dex;
  }

  getExpLevel() {
    return this.data.expLevel;
  }
}

const characterStore = new CharacterStore();
export default characterStore;
