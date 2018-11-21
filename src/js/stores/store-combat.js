import cloneDeep from 'lodash.cloneDeep';

import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class CombatStore extends Store {

  constructor() {
    super();
    this.data = {
      characterSurprised: false,
      inCombat: false,
      opponentsSurprised: false,
      opponents: [],
      round: 0,
      hasCurrTurn: null, // opponent obj, or string 'character'
    };
  }

  isInCombat() {
    return this.data.inCombat;
  }

  areOpponentsDefeated() {
    const remainingOpponents = this.data.opponents.filter((opponent) => {
      return !(opponent.isDefeated());
    });

    return !(remainingOpponents.length);
  }

  getTreasure() {
    const totalTreasure = this.data.opponents.map((opponent) => {
      return opponent.getTreasure();
    });

    return totalTreasure;
  }

}
export const combatStore = new CombatStore();

combatStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.START_COMBAT:
      const { 
        opponents,
        characterSurprised,
        opponentsSurprised
      } = action.payload;

      combatStore.data = Object.assign(combatStore.data, {
        inCombat: true,
        characterSurprised,
        opponentsSurprised
      });

      // set up opponents
      combatStore.data.opponents = cloneDeep(opponents);

      // set up rounds/turns
      combatStore.data.round = 1;
      // @todo handle initiative/surprise
      combatStore.data.hasCurrTurn = 'character';

      combatStore.triggerChange();
      break;

    case constants.END_COMBAT:
      combatStore.data = Object.assign(combatStore.data, {
        inCombat: false
      });
      combatStore.triggerChange();
      break;

    case constants.COMBAT_DAMAGE: 
      const {
        dmg,
        hitValue
      } = action.payload;

      if (!dmg || !hitValue) {
        throw new ReferenceError('dmg or hit value missing in COMBAT_DAMAGE action');
      }
      // @todo support multiple opponents
      const opponent = combatStore.data.opponents[0];
      opponent.takeDamage(dmg);

      combatStore.triggerChange();
      break;
    case constants.COMBAT_OPPONENTS_DEFEATED:
      
      break;
    default:
      break;
  }
});
