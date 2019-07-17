
import { dispatcher } from '../lib/game-dispatcher';
import { disburseTreasure } from '../lib/combat';
import * as constants from '../config/constants-actions.json';
import { combatStore } from '../stores/store-combat';
import { characterStore } from '../stores/store-character';
import { showGameMsg } from '../actions/actions-messages';
import { Damage } from '../models/model-damage';

export const startCombat = ({ 
  opponents,
  characterSurprised,
  opponentsSurprised
}) => {
  dispatcher.dispatch({
    type: constants.START_COMBAT,
    payload: {
      opponents,
      characterSurprised,
      opponentsSurprised
    }
  });
};

export const damageOpponent = (dmg) => {
  if (typeof dmg !== "number") {
    throw new TypeError('Invalid damage passed to damageOpponent');
  }
  
  dispatcher.dispatch({
    type: constants.COMBAT_DAMAGE_OPPONENT,
    payload: { dmg }
  });
};

export const endCombat = () => {
  dispatcher.dispatch({
    type: constants.END_COMBAT
  });
};

