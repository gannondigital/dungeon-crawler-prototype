
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';

export const startCombat = (opponents) => {
  dispatcher.dispatch({
    type: constants.START_COMBAT,
    payload: {
      opponents
    }
  });
};

export const endCombat = () => {
  dispatcher.dispatch({
    type: constants.END_COMBAT
  });
};
