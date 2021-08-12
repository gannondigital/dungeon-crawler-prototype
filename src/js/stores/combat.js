import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import Damage from "../models/damage";
import constants from "../constants";
import actionConstants from "../constants/actions";

const { OPPONENT, CHARACTER } = constants;
const {
  START_COMBAT,
  END_COMBAT,
  COMBAT_DAMAGE_OPPONENT,
  COMBAT_OPPONENTS_DEFEATED,
  COMBAT_SET_ADVANTAGE,
  COMBAT_START_TURN_OPPONENT,
  COMBAT_START_TURN_CHARACTER,
  COMBAT_START_ROUND,
  COMBAT_END_TURN_CHARACTER
} = actionConstants;

const initialState = {
  inCombat: false,
  opponentHasAdvantage: false,
  characterHasAdvantage: false,
  opponents: [],
  round: 0,
  hasCurrTurn: "" // CHARACTER or OPPONENT
};

class CombatStore extends Store {
  constructor() {
    super();
    this.data = Object.assign({}, initialState);
  }

  getOpponent() {
    return this.data.opponents[0];
  }

  isInCombat() {
    return this.data.inCombat;
  }

  areOpponentsDefeated() {
    const remainingOpponents = this.data.opponents.filter(opponent => {
      return !opponent.isDefeated();
    });

    return !remainingOpponents.length;
  }

  getTreasure() {
    const totalTreasure = this.data.opponents.map(opponent => {
      return opponent.getTreasure();
    });

    return totalTreasure;
  }

  getOpponentsName() {
    return this.getOpponent().getLabel();
  }

  getOpponentsLevel() {
    return this.getOpponent().getExpLevel();
  }

  getOpponentsStr() {
    return this.getOpponent().getStr();
  }

  getOpponentsEvasion() {
    return this.getOpponent().getEvasion();
  }

  getOpponentsArmor() {
    return this.getOpponent().getArmor();
  }

  opponentHasAdvantage() {
    return this.data.opponentHasAdvantage;
  }

  getOpponentsAttacks() {
    return this.getOpponent().getAttacks();
  }

  getOpponentsAccuracy() {
    return this.getOpponent().getAccuracy();
  }

  isCharactersTurn() {
    return this.data.hasCurrTurn === CHARACTER;
  }
}
const combatStore = new CombatStore();

combatStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case START_COMBAT:
      const { opponents } = action.payload;

      combatStore.data = Object.assign(combatStore.data, {
        inCombat: true
      });

      // set up opponents
      combatStore.data.opponents = cloneDeep(opponents);

      // set up rounds/turns
      combatStore.data.round = 1;

      combatStore.data.hasCurrTurn = "character";

      combatStore.triggerChange();
      break;

    case END_COMBAT:
      combatStore.data = Object.assign({}, initialState);
      combatStore.triggerChange();
      break;

    case COMBAT_DAMAGE_OPPONENT:
      const { dmg } = action.payload;

      // @todo support multiple opponents
      const opponent = combatStore.data.opponents[0];
      opponent.takeDamage(dmg);

      combatStore.triggerChange();
      break;

    case COMBAT_OPPONENTS_DEFEATED:
      break;

    case COMBAT_SET_ADVANTAGE:
      const { whoHasAdvantage } = action.payload;
      if (whoHasAdvantage && whoHasAdvantage === OPPONENT) {
        combatStore.data = Object.assign(combatStore.data, {
          opponentHasAdvantage: true,
          characterHasAdvantage: false
        });
      } else if (whoHasAdvantage && whoHasAdvantage === CHARACTER) {
        combatStore.data = Object.assign(combatStore.data, {
          characterHasAdvantage: true,
          opponentHasAdvantage: false
        });
      }
      combatStore.triggerChange();

      break;

    case COMBAT_START_ROUND:
      combatStore.data.round++;
      combatStore.triggerChange();
      break;

    case COMBAT_START_TURN_OPPONENT:
      combatStore.data.hasCurrTurn = OPPONENT;
      combatStore.triggerChange();
      break;

    case COMBAT_START_TURN_CHARACTER:
      combatStore.data.hasCurrTurn = CHARACTER;
      combatStore.triggerChange();
      break;

    case COMBAT_END_TURN_CHARACTER:
      combatStore.data.hasCurrTurn = "";
      combatStore.triggerChange();
    default:
      break;
  }
});

export default combatStore;
