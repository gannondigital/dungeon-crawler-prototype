import isEqual from "lodash.isEqual";
import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { MonsterFactory } from "../lib/monster-factory";
import { dispatcher } from "../lib/game-dispatcher";
import * as constants from "../constants/constants-actions";
import { Monster } from "../models/model-monster";

class MonsterStore extends Store {
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

export const monsterStore = new MonsterStore();
monsterStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case constants.MONSTERS_LOADED:
      const { levelName, monsters } = action.payload;
      if (!isEqual(monsterStore.data, action.payload)) {
        monsterStore.data.levelName = levelName;
        monsterStore.data.monsters = monsters;
        monsterStore.triggerChange();
      }

      break;
    default:
      break;
  }
});
