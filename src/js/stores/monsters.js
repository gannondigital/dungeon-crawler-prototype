import isEqual from "lodash.isEqual";
import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { MonsterFactory } from "../lib/monster-factory";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";
import { Monster } from "../models/model-monster";

class MonstersStore extends Store {
  constructor() {
    super();
    this.data = {
      levelName: "none",
      monsters: {}
    };
  }

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

    return MonsterFactory(cloneDeep(monsterData));
  }
}

const monstersStore = new MonstersStore();
monstersStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case constants.MONSTERS_LOADED:
      const { levelName, monsters } = action.payload;
      if (!isEqual(monstersStore.data, action.payload)) {
        monstersStore.data.levelName = levelName;
        monstersStore.data.monsters = monsters;
        monstersStore.triggerChange();
      }

      break;
    default:
      break;
  }
});

export default monstersStore;
