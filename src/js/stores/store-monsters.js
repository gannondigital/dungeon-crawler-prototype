import { default as isEqual } from 'lodash.isEqual';
import { default as cloneDeep } from 'lodash.cloneDeep';

import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';
import { Monster } from '../models/model-monster';

class MonsterStore extends Store {

  constructor() {
    super();
    this.data = {
      levelName: 'none',
      monsters: {

      }
    };
  }

  getLevelName() {
    return this.data.levelName;
  }

  getMonster(monsterName) {
    const monsterData = this.data.monsters[monsterName];
    if (typeof monsterData === 'undefined') {
      throw new ReferenceError(`Monster ${monsterName} not found in monsterStore`);
    }

    return new Monster(cloneDeep(monsterData));
  }

}

export const monsterStore = new MonsterStore();
monsterStore.dispatchToken = dispatcher.register((action) => {
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
