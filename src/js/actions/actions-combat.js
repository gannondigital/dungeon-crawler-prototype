
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';

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

export const endCombat = () => {
  dispatcher.dispatch({
    type: constants.END_COMBAT
  });
};

export const attack = ({
  dmg,
  hitValue
}) => {
  dispatcher.dispatch({
    type: constants.COMBAT_ATTACK,
    payload: {
      hitValue
    }
  });
};
