
import { dispatcher } from '../lib/game-dispatcher';
import { disburseTreasure } from '../lib/combat';
import * as constants from '../config/constants-actions.json';
import { combatStore } from '../stores/store-combat';
import { characterStore } from '../stores/store-character';
import { showGameMsg } from '../actions/actions-messages';

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
  if (!dmg || typeof dmg !== 'object' || !hitValue || typeof hitValue !== 'number') {
    throw new ReferenceError('Invalid dmg/hitValue passed to attack action creator');
  }
  // @todo don't always hit
  const hitSucceeded = true;

  dispatcher.dispatch({
    type: constants.COMBAT_DAMAGE,
    payload: {
      dmg,
      hitValue
    }
  });

  showGameMsg(`Did ${hitValue} damage!`);

  // this makes it more of a saga but no need to pull in a whole lib
  if (combatStore.areOpponentsDefeated()) {
    const treasure = combatStore.getTreasure();
    //disburseTreasure(treasure);

    const tileName = characterStore.getCurrTileName();
    dispatcher.dispatch({
      type: constants.ADD_TO_RECORD,
      payload: {
        eventName: 'opponentsDefeated',
        tileName
      }
    });

    showGameMsg('Opponents defeated!');

    dispatcher.dispatch({
      type: constants.END_COMBAT,
    });
  }
};
