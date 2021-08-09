import { dispatcher } from "../lib/game-dispatcher";
import { disburseTreasure } from "../lib/combat";
import {
  START_COMBAT,
  COMBAT_DAMAGE_OPPONENT,
  COMBAT_DAMAGE_CHARACTER,
  END_COMBAT,
  COMBAT_SET_ADVANTAGE,
  COMBAT_START_ROUND,
  COMBAT_START_TURN_OPPONENT,
  COMBAT_START_TURN_CHARACTER,
  COMBAT_END_TURN_CHARACTER
} from "../constants/constants-actions";
import { CHARACTER, OPPONENT } from "../constants/constants-general";
import { combatStore } from "../stores/store-combat";
import { characterStore } from "../stores/store-character";
import { showGameMsg } from "../actions/actions-messages";
import { Damage } from "../models/model-damage";

export const startCombat = ({
  opponents,
  characterSurprised,
  opponentsSurprised
}) => {
  dispatcher.dispatch({
    type: START_COMBAT,
    payload: {
      opponents,
      characterSurprised,
      opponentsSurprised
    }
  });
};

export const damageOpponent = dmg => {
  if (typeof dmg !== "number") {
    throw new TypeError("Invalid damage passed to damageOpponent");
  }

  dispatcher.dispatch({
    type: COMBAT_DAMAGE_OPPONENT,
    payload: { dmg }
  });
};

export const damageCharacter = dmg => {
  if (typeof dmg !== "number") {
    throw new TypeError("Invalid damage passed to damageCharacter");
  }

  dispatcher.dispatch({
    type: COMBAT_DAMAGE_CHARACTER,
    payload: { dmg }
  });
};

export const endCombat = () => {
  dispatcher.dispatch({
    type: END_COMBAT
  });
};

export const setAdvantage = whoHasAdvantage => {
  if (
    whoHasAdvantage &&
    whoHasAdvantage !== CHARACTER &&
    whoHasAdvantage !== OPPONENT
  ) {
    throw new TypeError("Invalid party passed to setAdvantage");
  }

  dispatcher.dispatch({
    type: COMBAT_SET_ADVANTAGE,
    payload: {
      whoHasAdvantage
    }
  });
};

export const startRound = () => {
  dispatcher.dispatch({
    type: COMBAT_START_ROUND
  });
};

export const startOpponentsTurn = () => {
  console.log("starting opponents turn");
  dispatcher.dispatch({
    type: COMBAT_START_TURN_OPPONENT
  });
};

export const startCharactersTurn = () => {
  console.log("starting chars turn");
  dispatcher.dispatch({
    type: COMBAT_START_TURN_CHARACTER
  });
};

export const endCharactersTurn = () => {
  console.log("ending chars turn");
  dispatcher.dispatch({
    type: COMBAT_END_TURN_CHARACTER
  });
};
