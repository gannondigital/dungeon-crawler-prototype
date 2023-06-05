import { dispatcher } from "../lib/game-dispatcher";
import { CHARACTER, OPPONENTS } from "../constants";
import {
  START_COMBAT,
  COMBAT_DAMAGE_OPPONENT,
  COMBAT_DAMAGE_CHARACTER,
  COMBAT_ATTACK_OPPONENT,
  END_COMBAT,
  COMBAT_SET_ADVANTAGE,
  COMBAT_START_ROUND,
  COMBAT_START_TURN_OPPONENTS,
  COMBAT_START_TURN_CHARACTER,
  COMBAT_END_TURN_CHARACTER,
} from "../constants/actions";

/**
 * @todo I think I prefer validating input at the store
 * @param {Object} payloadProps
 * @param {Array<>} payloadProps.opponents
 * @param {String|null} payloadProps.hasAdvantage
 */
export const startCombat = ({ opponents, hasAdvantage = null }) => {
  if (hasAdvantage && ![CHARACTER, OPPONENTS].includes(hasAdvantage)) {
    throw new TypeError("Invalid hasAdvantage passed to startCombat");
  }
  // @todo verify that each opponent is valid -- Opponent model TBD
  if (!Array.isArray(opponents) || opponents.length === 0) {
    throw new TypeError("Invalid opponents passed to startCombat");
  }

  dispatcher.dispatch({
    type: START_COMBAT,
    payload: {
      opponents,
      hasAdvantage,
    },
  });
};

export const damageOpponent = (dmg) => {
  if (typeof dmg !== "number" || isNaN(dmg)) {
    throw new TypeError("Invalid damage passed to damageOpponent");
  }

  dispatcher.dispatch({
    type: COMBAT_DAMAGE_OPPONENT,
    payload: { dmg },
  });
};

export const damageCharacter = (dmg) => {
  if (typeof dmg !== "number" || isNaN(dmg)) {
    throw new TypeError("Invalid damage passed to damageCharacter");
  }

  dispatcher.dispatch({
    type: COMBAT_DAMAGE_CHARACTER,
    payload: { dmg },
  });
};

export const attackOpponent = () => {
  dispatcher.dispatch({
    type: COMBAT_ATTACK_OPPONENT,
    payload: {},
  });
};

export const endCombat = () => {
  dispatcher.dispatch({
    type: END_COMBAT,
    payload: {},
  });
};

// @todo this can probably be removed? advantage only set once
// when combat begins
export const setAdvantage = (whoHasAdvantage) => {
  if (
    whoHasAdvantage &&
    whoHasAdvantage !== CHARACTER &&
    whoHasAdvantage !== OPPONENTS
  ) {
    throw new TypeError("Invalid party passed to setAdvantage");
  }

  dispatcher.dispatch({
    type: COMBAT_SET_ADVANTAGE,
    payload: {
      whoHasAdvantage,
    },
  });
};

// @todo another place where we have nested dispatch, cheating
// around it for now
export const startRound = () => {
  dispatcher.dispatch({
    type: COMBAT_START_ROUND,
    payload: {},
  });
};

export const startOpponentsTurn = () => {
  console.log("starting opponents turn");
  dispatcher.dispatch({
    type: COMBAT_START_TURN_OPPONENTS,
    payload: {},
  });
};

export const startCharactersTurn = () => {
  console.log("starting chars turn");
  dispatcher.dispatch({
    type: COMBAT_START_TURN_CHARACTER,
    payload: {},
  });
};

export const endCharactersTurn = () => {
  console.log("ending chars turn");
  dispatcher.dispatch({
    type: COMBAT_END_TURN_CHARACTER,
    payload: {},
  });
};
