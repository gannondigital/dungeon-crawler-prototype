
import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class CombatStore extends Store {

  constructor() {
    super();
    this.data = {
      characterSurprised: false,
      inCombat: false,
      monsterSurprised: false,
      opponents: [],
      round: 0,
      currTurn: null,
    };
  }

  isInCombat() {
    return this.data.inCombat;
  }

}

export const combatStore = new CombatStore();

combatStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.START_COMBAT:
      const { opponents } = action.payload;
      combatStore.data = Object.assign(combatStore.data, {
        inCombat: true,
        opponents
      });
      combatStore.triggerChange();
      break;
    case constants.END_COMBAT:
      combatStore.data = Object.assign(combatStore.data, {
        inCombat: false
      });
      combatStore.triggerChange();
      break;
    default:
      break;
  }
});
