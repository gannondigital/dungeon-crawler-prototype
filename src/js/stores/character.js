import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import actionConstants from "../constants/actions";

const {
  TILE_SET,
  DIRECTION_SET,
  COMBAT_DAMAGE_CHARACTER
} = actionConstants;

class CharacterStore extends Store {
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
        stamina: 0
      },
      expLevel: 1
    };
  }

  getDirection() {
    return this.data.currDirection;
  }

  getCurrTileName() {
    return this.data.currTileName;
  }

  getAccuracy() {
    return this.data.attributes.accuracy;
  }

  getStr() {
    return this.data.attributes.str;
  }

  getIntVal() {
    return this.data.attributes.intelligence;
  }

  getEvasion() {
    return this.data.attributes.dex;
  }

  getExpLevel() {
    return this.data.expLevel;
  }
}

const characterStore = new CharacterStore();

characterStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case TILE_SET:
      characterStore.data.currTileName = action.payload.tileName;
      characterStore.triggerChange();
      break;

    case DIRECTION_SET:
      const newDir = action.payload.direction;
      if (!newDir || typeof newDir !== "string") {
        throw new TypeError(
          "Invalid direction received from DIRECTION_SET action"
        );
      }

      const oldDirection = characterStore.data.currDirection;
      characterStore.data.currDirection = action.payload.direction;
      if (oldDirection !== characterStore.data.currDirection) {
        characterStore.triggerChange();
      }
      break;

    case COMBAT_DAMAGE_CHARACTER:
      const { dmg } = action.payload;
      if (dmg) {
        const {
          data: { health }
        } = characterStore;
        characterStore.data.health = health - dmg;
        // @todo handle character "death"
        if (characterStore.data.health <= 0) {
          console.log("zero health!");
        }
        characterStore.triggerChange();
      }
      break;

    default:
      break;
  }
});
export default characterStore;
