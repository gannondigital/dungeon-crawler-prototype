import isEqual from "lodash.isEqual";
import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { MONSTERS_LOADED } from "../constants/actions";

class MonstersStore extends Store {
  constructor() {
    super();
    this.data = {
      levelName: "none",
      monsters: {}
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  handleAction = (action) => {
    const { type, payload } = action;
    switch (type) {
      case MONSTERS_LOADED:
        const { levelName, monsters } = payload;
        if (!isEqual(this.data, payload)) {
          this.data = {
            levelName,
            monsters
          };
          this.triggerChange();
        }
  
        break;
      default:
        break;
    }
  };

  getLevelName() {
    return this.data.levelName;
  }

  getMonster(monsterName) {
    const monsterData = this.data.monsters[monsterName];
    if (typeof monsterData === "undefined") {
      throw new ReferenceError(
        `Monster ${monsterName} not found in monsterStore`
      );
    }

    return cloneDeep(monsterData);
  }
}

const monstersStore = new MonstersStore();
export default monstersStore;
