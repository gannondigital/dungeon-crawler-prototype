import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import Damage from "../models/damage";
import { OPPONENTS, CHARACTER } from "../constants";
import {
  START_COMBAT,
  END_COMBAT,
  COMBAT_DAMAGE_OPPONENT,
  COMBAT_OPPONENTS_DEFEATED,
  COMBAT_START_TURN_OPPONENTS,
  COMBAT_START_TURN_CHARACTER,
  COMBAT_START_ROUND,
  COMBAT_END_TURN_CHARACTER,
  TILE_SET
} from "../constants/actions";

const initialState = {
  inCombat: false,
  hasAdvantage: null,
  // opponents is plural even though only one is currently supported
  // -- I usually don't do this, but multiple opponents is inevitable
  opponents: null,
  round: 0,
  hasCurrTurn: CHARACTER
};

/**
 * @todo This should look more like a state machine, enforcing gameplay constraints.
 * It shouldn't be possible for combat to happen out of order, for example, 
 * because of developer error elsewhere; that should raise an exception. 
 * It should only be possible to advance from a given state to one or two explicitly
 * defined subsequent states; the methods to do this should be semantic
 */
class CombatStore extends Store {
  constructor() {
    super();
    // @todo think more about where we do/don't deep clone
    this.data = Object.assign({}, initialState);
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  /**
   * @param {Object} action
   *        {String} action.type
   *        {Object} action.payload
   *        {Array} action.payload.opponents
   *        {String|null} action.payload.hasAdvantage
   */
  handleAction = action => {
    // I'm 50/50 on defining all the potential payloads here
    const {
      type,
      payload: {
        dmg,
        hasAdvantage,
        opponents,
      }
    } = action;
    // @todo smallify this switch by breaking out more handlers,
    // like handleSetTile. If the store gets too big, think
    // about whether there's a subdivision of responsibilities
    switch (type) {
      case START_COMBAT:
        if (this.data.inCombat) {
          throw new Error('Combat started when already in combat');
        }

        // @todo may want to support more initial combat state via payload
        if (!Array.isArray(opponents) || opponents.length === 0) {
          throw new TypeError('Invalid opponents passed with START_COMBAT');
        }
        
        // @todo going to put param validation into the action creators themselves,
        // is there a good reason this is here and not there?
        // keeping the validation here makes this class more cohesive
        if (hasAdvantage && ![OPPONENTS, CHARACTER].includes(hasAdvantage)) {
          throw new TypeError('Invalid party with advantage at start of combat');
        }

        this.data = {
          inCombat: true,
          round: 1,
          hasCurrTurn: null,
          hasAdvantage,
          opponents
        };

        this.triggerChange();
        break;
  
      case END_COMBAT:
        // @todo if I want to develop this pattern, could formalize ideas
        // like StateMachine or LogicalConstraint
        if (!this.data.inCombat) {
          throw new Error('Combat ended when combat was not in progress.')
        }
        
        this.data = {
          ...initialState,
          opponents: null
        };
        this.triggerChange();
        break;
  
      // @todo rounds aren't in use right now, but will be
      // the fundamental unit of time in combat, e.g. 
      // effect duration will be defined as # of rounds
      // @todo consider enforcing that a round can't start 
      // until all parties have taken turns
      case COMBAT_START_ROUND:
        if (!this.isInCombat() ) {
          throw new Error('Combat round started when combat had not started.');
        }

        this.data.round++;
        this.triggerChange();
        break;
  
      // @todo namespacing the actions this way is probably not where
      // I'm going to land on action organization
      case COMBAT_START_TURN_OPPONENTS:
        if (!this.isInCombat() ) {
          throw new Error('Combat turn started when combat had not started.');
        }

        this.data.hasCurrTurn = OPPONENTS;
        this.triggerChange();
        break;
  
      // @todo not 100% on the model for this, this store might be handling
      // some of these updates in response to other events, reducer-style,
      // since it knows enough to advance from one combat phase to another.
      // but this is at least reasonably coherent
      case COMBAT_START_TURN_CHARACTER:
        if (!this.isInCombat() ) {
          throw new Error('Combat turn started when combat had not started.');
        }

        this.data.hasCurrTurn = CHARACTER;
        this.triggerChange();
        break;
  
      // @todo this is unneeded & should be removed, it's only used 1 place.
      // it's always someone's turn, so the combat runner can take care of 
      // setting the party with the current turn (if we even need to?) and
      // starting a new round
      case COMBAT_END_TURN_CHARACTER:
        this.data.hasCurrTurn = null;
        this.triggerChange();

      // @todo should this live in an Opponent namespace instead? And/or
      // should it even be event based, opponents are part of the combat domain
      // & should be understood by, e.g. the combat runner
      case COMBAT_DAMAGE_OPPONENT:
  
        // @todo support multiple opponents
        // @todo opponent should be moved out of this store
        const opponent = this.data.opponents[0];
        opponent.takeDamage(dmg);
  
        this.triggerChange();
        break;
  
      // @todo currently unused, should it be used or removed
      case COMBAT_OPPONENTS_DEFEATED:
        break;
      default:
        break;
    }
  }

  getOpponent() {
    return this.data.opponents[0];
  }

  isInCombat() {
    return this.data.inCombat;
  }

  areOpponentsDefeated() {
    return this.data.opponents.reduce((areAllDefeated, opponent) => {
      return areAllDefeated && opponent.isDefeated();
    }, true);
  }

  /**
   * @todo this probably belongs in an Opponent class, it's really 
   * just calling a Monster's method, for an array of monsters
   * @returns {Array<Treasure>}
   */
  getTreasure() {
    return this.data.opponents.map(opponent => {
      return opponent.getTreasure();
    });
  }

  // ditto
  getOpponentsName() {
    return this.getOpponent().getLabel();
  }

  // ditto
  getOpponentsLevel() {
    return this.getOpponent().getExpLevel();
  }

  // same
  getOpponentsStr() {
    return this.getOpponent().getStr();
  }

  // obv
  getOpponentsEvasion() {
    return this.getOpponent().getEvasion();
  }

  getOpponentsArmor() {
    return this.getOpponent().getArmor();
  }

  /**
   * In combat, the character, the opponents, or neither, can have
   * advantage. It does not change during the course of combat
   * @returns {String|null}
   */
  whoHasAdvantage() {
    return this.data.hasAdvantage || null;
  }

  // @todo obv there shouldn't be this, and the method above, fix
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
export default combatStore;
