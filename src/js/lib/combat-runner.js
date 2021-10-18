import { dispatcher } from "../lib/game-dispatcher";
import combatStore from "../stores/combat";
import characterStore from "../stores/character";
import inventoryStore from "../stores/inventory";
import levelStore from "../stores/level";
import playHistoryStore from "../stores/play-history";
import { showGameMsg } from "../actions/messages";
import {
  damageCharacter,
  damageOpponent,
  endCombat,
  startRound,
  startOpponentsTurn,
  startCharactersTurn
} from "../actions/combat";
import { addToInventory } from "../actions/inventory";
import { addToPlayHistory } from "../actions/play-history";
import { SET_TILE } from "../constants/";
import {
  START_COMBAT,
  COMBAT_ACTION_ATTACK, // @todo these names/models aren't right
  COMBAT_ATTACK_OPPONENT,
  HIT_CONST,
  DELAY_BETWEEN_TURNS_MS,
  POLLING_INTERVAL_FOR_CHAR_ACTION
} from "../constants/actions";
import { getRandomNum } from "./util";
import { OPPONENTS } from "../constants";
import {
  DMG_PROTECTED_MOD,
  DMG_VULNERABLE_MOD
} from "../constants/combat";
import OpponentAttack from "../models/opponent-attack";
import Damage from "../models/damage";
import Defense from "../models/defense";

/**
 * Responsible for orchestrating turn based combat between player
 * and opponent.
 * 
 * @todo this maybe should be broken further into the combat runner and
 * combat system -- e.g. running rounds vs. calculating hit and damage
 */
class CombatRunner {

  // @todo enforce logical constraints, e.g. can't attack if not in combat
  handleAction = action => {
    const {
      type
    } = action;
    switch(type) {
      case SET_TILE:
        dispatcher.waitFor([characterStore.dispatchToken]);
        this.checkTileForCombat();
        break;
      // @todo SET_TILE above will remove the need for a START_COMBAT action
      case START_COMBAT:
        // ensure combat store has handled this action before we do 
        dispatcher.waitFor([combatStore.dispatchToken]);
        this.startCombat();
        break;

      case COMBAT_ATTACK_OPPONENT:
        this.attackOpponent();
        break;

      default:
        break;
    }
  };

  constructor() {
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  // @todo does this belong here? should maybe be a method of Tile
  tileHasUndefeatedOpponents(tile) {
    const tilename = tile.getName();
    const monsters = tile.getMonsters() || [];
    // @todo is this the right way to model? monsters are always there
    // and we check the play history to see if they're defeated...?
    return monsters.length &&
      !playHistoryStore.getTileEvent(tilename, "opponentsDefeated");
  }

  checkTileForCombat() {
    const currTileName = characterStore.getCurrTileName();
    const tile = levelStore.getTile(currTileName);

    if (this.tileHasUndefeatedOpponents(tile)) {
      const monsters = tile.getMonsters();
      // @todo review -- do we still need an event, if not fix
      // the combat store
      this.startCombat({
        opponents: monsters
      });
    }
  }

  /**
   * Responsible for everything that happens once at the start of combat.
   * Validates that store knows we're in combat, shows message to player,
   * then kicks off turn-based combat loop
   */
  startCombat() {
    // @todo this now duplicates a check done in the store itself when
    // handling the action, which seems better. Cut here?
    // keeping validation in this class makes keeps the logical
    // restraints as part of the business logic, which is good.
    // maybe state-based validation (e.g. we are not in combat)
    // does belong here, external argument validation belongs in action
    if (!combatStore.isInCombat()) {
      throw new Error("Combat store is not in combat");
    }
    
    const opponentName = combatStore.getOpponentsName();
    showGameMsg(`${opponentName} attacked!`);
    this.runCombat(combatStore.whoHasAdvantage());
  }

  /**
   * Runs combat rounds, each consisting of one character
   * turn and one opponent turn. Stops when store indicates that 
   * combat is over
   */
  async runCombat(whoHasAdvantage) {
    // @todo should orderedPartyTurns be a stateful property of the
    // runner, rather than an argument
    const { runTurnForCharacter, runTurnForOpponent } = this;
    // there's a ton of ways to handle the polymorphism of turn-running,
    // but this doesn't need to scale, combat will always be two sides
    const orderedPartyTurns = whoHasAdvantage === OPPONENTS ?
      [runTurnForOpponent, runTurnForCharacter] :
      [runTurnForCharacter, runTurnForOpponent];

    // combat actions taken during the round will cause combat to end
    while (combatStore.isInCombat()) {
      await this.runRound(orderedPartyTurns);
    }
  }


  // @todo should any of this responsibility live in the 
  // Treasure class...?
  /**
   * 
   * @param {Array<Treasure>} treasures 
   */
  disburseTreasure(treasures) {
    treasures.forEach(treasure => {
      showGameMsg(treasure.getReceivedMessages());
      addToInventory(treasure.getItemsForInventory());
    });
  };

  handleOpponentsDefeat() {
    const opponentName = combatStore.getOpponentsName();
    // @todo if we have a reference to the opponent(s), which 
    // we do, why not getTreasure as a method of the opponent?
    // Or maybe a Treasure represents the total treasure for
    // the entire party defeated/the entire combat? More useful
    // in that sense, and that's where each opponent would get
    // its getTreasure called
    const treasure = combatStore.getTreasure();
    // @todo TBD whether this is even specific to the combat domain
    // -- could easily see other reasons for the player to receive
    // 'treasure' -- are there any bases not covered between 
    // disburseTreasure (combat-specific) and addToInventory?
    this.disburseTreasure(treasure);

    // @todo this whole model is likely to get more sophisticated
    addToPlayHistory({
      eventName: "opponentsDefeated",
      tileName: characterStore.getCurrTileName()
    });

    showGameMsg(`${opponentName} defeated!`);
    endCombat();
  }

  // this behavior could easily change as engine develops,
  // not going to try and pre-design something clever
  // @todo this is another place where 'action' is used outside
  // of its flux context, 'combat actions'
  // @todo once multiple opponents or protagonists are introduced,
  // the idea of a 'party' will need to be formalized, and
  // action order revisited
  runRound(orderedPartyTurns) {
    return new Promise(async (resolve, reject) => {
      startRound();

      // @todo is it weird to drop async/await here? only need
      // the outer promise syntax for the delayed `resolve`
      orderedPartyTurns.forEach(async turnRunner => {
        try {
          // only the character runner is async right now, but this works
          await turnRunner();
          // @todo this might not be the right place for it, will be
          // clearer when other turn actions, & other ways of ending
          // turns, are added
          if (combatStore.areOpponentsDefeated()) {
            this.handleOpponentsDefeat();
          }
        } catch (err) {
          reject(err);
        }

        // for smooth gameplay we need a delay between character
        // & opponents' turns
        setTimeout(() => {
          resolve();
        }, DELAY_BETWEEN_TURNS_MS)
      });
    });
  }

  /**
   * @todo support running, magic, item combat actions, currently only attacks
   * @todo build some modicum of intelligence into this -- when do they try
   * to run/heal/change attack strategy? Maybe predefined tiers of cleverness,
   * monster data could specify a monster's tier. Or something less on rails
   * @param {Array<OpponentAttack>} attacks Array of OpponentAttack objects 
   * @returns {Object}  A 'combat action' object
   */
   chooseOpponentsAction(attacks) {
    const attackList = Object.keys(attacks);
    // this check could probably be handled earlier on, and we trust here
    if (attackList.length === 0) {
      throw new ReferenceError("opponent has no attacks");
    }

    // @todo getRandomNum should handle the length = 1 case correctly
    // so we don't have to branch logic. 
    const attackName = attackList.length === 1 ? attackList[0] :
      attackList[getRandomNum(attackList.length - 1)];
  
    const action = {
      type: COMBAT_ACTION_ATTACK,
      attack: attacks[attackName]
    };
    return action;
  };

  /**
   * @todo again this is a value derived from existing state and
   * a property of the Opponent. Doesn't belong here
   * @param {OpponentAttack} attack 
   * @returns {Number}
   */
  getOpponentsTotalAccuracy(attack) {
    return combatStore.getOpponentsAccuracy() + attack.getAccuracyMod();
  };

  // @todo tune tune tune this is totally random
  doesAttackHit(attackerAccuracy, defenderEvasion) {
    if (getRandomNum() - defenderEvasion + attackerAccuracy > HIT_CONST) {
      return true;
    }
    return false;
  };

  /**
   * @todo does this belong in an Opponent class?
   * @todo tune tune tune, totally random
   * @param  {OpponentAttack} attack
   * @return {Damage}
   */
   getDmgDealtByOpponent(attack) {
    const dmgTypes = attack.getDmgTypes();

    // should dmg vary this much?
    const attackDmg = getRandomNum(attack.getDmgPoints());
    const opponentLevelDmgMod = getRandomNum(combatStore.getOpponentsLevel());
    const opponentStrMod = combatStore.getOpponentsStr();

    const baseDmgDealt = attackDmg + opponentLevelDmgMod + opponentStrMod;
    return new Damage({ dmgPoints: baseDmgDealt, types: dmgTypes });
  };

  /**
   * @todo this is a property of the opponent, and derived from existing state
   */
  getCharactersDefense() {
    const activeArmor = inventoryStore.getActiveArmor();
    const protection = activeArmor.getProtection();
    const protectedAgainst = activeArmor.getProtectedAgainst();
    const vulnerableTo = activeArmor.getVulnerableTo();
    return new Defense({ protection, protectedAgainst, vulnerableTo });
  };

  /**
   * Starting with a basic Dmg, applies modifiers based on protection/
   * vulnerability
   * @todo tune tune tune, totally random
   * @param  {Damage} dmg     Dmg object
   * @param  {Defense} defense Defense object
   * @return {Number}         Damage done taking into account protection/
   *                          vulnerability
   */
  calculateModifiedDmg(dmg, defense) {
    const dmgPoints = dmg.getDmgPoints();
    const dmgTypes = dmg.getTypes();
    const protection = defense.getProtection();

    // protection takes precedence over vulnerability
    const isProtected = defense.isProtectedAgainst(dmgTypes);
    const isVulnerable = !isProtected && defense.isVulnerableTo(dmgTypes);

    let modifiedDmg = dmgPoints;
    if (isProtected) {
      modifiedDmg = modifiedDmg * DMG_PROTECTED_MOD;
    } else if (isVulnerable) {
      modifiedDmg = modifiedDmg * DMG_VULNERABLE_MOD;
    }

    modifiedDmg = modifiedDmg - protection;
    return modifiedDmg;
  };

  /**
   * Does all the things when an opponent hits a character
   * @todo currently the character never 'dies', zero health
   * has no effect on gameplay :P but hey that's what demo means
   * @param  {OpponentAttack} attack
   */
   handleHitToCharacter(attack) {
    const opponentName = combatStore.getOpponentsName();
    const dmg = this.getDmgDealtByOpponent(attack);
    const defense = this.getCharactersDefense();

    const modifiedDmg = this.calculateModifiedDmg(dmg, defense);
    damageCharacter(modifiedDmg);

    showGameMsg(`${opponentName} did ${modifiedDmg} damage!`);
    // @todo handle zero health/game over
  };

  handleMissToCharacter() {
    const opponentName = combatStore.getOpponentsName();
    showGameMsg(`${opponentName} missed!`);
  };

  /**
   * @todo on the fence about whether this belongs in the combat runner 
   * or the Opponent class. Former establishes a more rigid but more predictable
   * pattern. Worth thinking about how not to paint ourselves into corner re:
   * targeting a specific character/opponent in a party (future looking)
   * Coordinates an opponent attack on the character
   * @param  {OpponentAttack} attack An OpponentAttack representing
   *                                 the attack being used
   */
   attackCharacter(attack) {
    const charEvasion = characterStore.getEvasion();
    const totalAccuracy = this.getOpponentsTotalAccuracy(attack);

    this.doesAttackHit(totalAccuracy, charEvasion) ?
      this.handleHitToCharacter(attack) :
      this.handleMissToCharacter()
  }

  runTurnForOpponent = () => {
    // @todo revisit this. how much do we have to track whose turn it is?
    // what's the right model?
    startOpponentsTurn();

    // @todo at least some of this  probably belongs in an Opponent class
    const attacks = combatStore.getOpponentsAttacks();
    const combatAction = this.              (attacks);
    // @todo this is some nascent DSL for actions you can take in 
    // combat. Is there any overlap with flux actions; if so how much
    // if not, maybe use a different term from 'combat action'
    const { type, attack } = combatAction;
    // this is where 'run', 'item' etc. would go
    switch (type) {
      case COMBAT_ACTION_ATTACK:
        this.attackCharacter(attack);
        return;

      default:
        throw new TypeError("Unrecognized combat action type");
    }
  };

  /**
   * Any combat action by the character will end their turn,
   * so we poll for the character's turn to be done. 
   * Would be more idiomatic to fire & respond to events...?
   * ...that sounds like a generator (a la sagas)
   * as a rule, communication within the combat domain would not be 
   * event based, but this maybe makes the most sense that way?
   * @todo if I keep it this way, still need to revisit how to model
   * 'whose turn it is'
   * @todo it's too side-effecty that the state change shows a UI,
   * and interacting with the UI fires a handler, which can eventually
   * change the state that ends this polling
   */
  runTurnForCharacter = async () => {
    return new Promise((resolve, reject) => {
      startCharactersTurn();

      const charTurnCheck = setInterval(() => {
        if (!combatStore.isCharactersTurn()) {
          clearInterval(charTurnCheck);
          resolve();
        }
      }, POLLING_INTERVAL_FOR_CHAR_ACTION);
    });
  };

  /**
   * @todo this value is derived from existing state and 
   * essentially a property of the character. Should it live
   * in the CharacterStore?
   * @todo can there ever be no weapon selected? probably can
   * avoid it for now, but it seems a likely use case
   * @returns {Number}
   */
  getCharactersTotalAccuracy() {
    const selectedWeapon = inventoryStore.getActiveWeapon();
    // @todo active armor modifiers also
    return characterStore.getAccuracy() + selectedWeapon.getAccuracyMod();
  };

  /**
   * @todo tune tune tune, totally random right now
   * @todo does this belong in the character model or something?
   * @todo let some attacks use attrs other than Str as a modifier
   * @todo get a Damage from weapon and derive a new Damage from it
   *       (requires Damage be composable w/itself, obv)
   * @returns {Damage}
   */
  getDmgDealtByCharacter = () => {
    const activeWeapon = inventoryStore.getActiveWeapon();
    const dmgTypes = activeWeapon.getDmgTypes();

    // weapon's base damage
    const weaponDmg = getRandomNum(activeWeapon.getDmg());
    // adjustment for character level
    const characterLevelDmgMod = getRandomNum(characterStore.getExpLevel());
    // adjustment for character strength
    const characterStrMod = characterStore.getStr();

    const baseDmgDealt = weaponDmg + characterLevelDmgMod + characterStrMod;
    return new Damage({ dmgPoints: baseDmgDealt, types: dmgTypes });
  }

  /**
   * @todo this is a property of the opponent, and derived from existing state
   * @returns {Defense}
   */
  getOpponentsDefense() {
    const armor = combatStore.getOpponentsArmor();
    const { protection, protectedAgainst, vulnerableTo } = armor;
    return new Defense({ protection, protectedAgainst, vulnerableTo });
  }

  /**
   * @todo some of this may belong in an Opponent class
   */
  handleHitToOpponent() {
    const opponentName = combatStore.getOpponentsName();
    const dmg = this.getDmgDealtByCharacter();
    const defense = this.getOpponentsDefense();
  
    const modifiedDmg = this.calculateModifiedDmg(dmg, defense);
    damageOpponent(modifiedDmg);
  
    showGameMsg(`Did ${modifiedDmg} damage!`);
  }

  handleMissToOpponent() {
    showGameMsg("Missed!");
  }

  attackOpponent() {
    const hitSucceeded = this.doesAttackHit(
      this.getCharactersTotalAccuracy(),
      combatStore.getOpponentsEvasion()
    );
  
    hitSucceeded ? this.handleHitToOpponent() : this.handleMissToOpponent();
  }
}
