// @todo this file is a beast, it does probably make sense
// as a combat library but at the very least it could be split
// out into better encapsulated submodules

// @todo visual cues for attacks & damage in the UI

import { showGameMsg } from "../actions/actions-messages";
import { addToInventory } from "../actions/actions-inventory";
import {
  startCombat as startCombatAction,
  damageOpponent,
  damageCharacter,
  endCombat,
  setAdvantage,
  startRound,
  startOpponentsTurn,
  startCharactersTurn
} from "../actions/actions-combat";
import { addToPlayHistory } from "../actions/actions-playhistory";
import { playHistoryStore } from "../stores/store-play-history";
import { combatStore } from "../stores/store-combat";
import { characterStore } from "../stores/store-character";
import { inventoryStore } from "../stores/store-inventory";
import { Damage } from "../models/model-damage";
import Defense from "../models/model-defense";
import { getRandomNum } from "./util";
import constants from "../constants";
import combatConstants from "../constants/combat";

const { MSG_SPEED_MED } = constants;
const { COMBAT_ACTION_ATTACK } = combatConstants;
const HIT_CONST = 10;
const DELAY_BETWEEN_TURNS_MS = 1250;
const POLLING_INTERVAL_FOR_CHAR_ACTION = 250;

export const startCombat = ({ whoHasAdvantage }) => {
  setAdvantage(whoHasAdvantage);
  const opponentName = combatStore.getOpponentsName();
  showGameMsg(`${opponentName} attacked!`);
  runCombat();
};

const runCombat = () => {
  let isInCombat = combatStore.isInCombat();
  if (!isInCombat) {
    throw new Error("runCombat called when combat not started");
  }

  runCombatRounds();
};

// @todo this is even worse now, refactor
const runCombatRounds = () => {
  startRound();

  if (combatStore.opponentHasAdvantage()) {
    runTurnForOpponent()
      .then(() => {
        if (!combatStore.isInCombat()) {
          return;
        }

        return runTurnForCharacter();
      })
      .then(() => {
        if (combatStore.isInCombat()) {
          runCombatRounds();
        }
      })
      .catch(err => {
        throw err;
      });
  } else {
    runTurnForCharacter()
      .then(() => {
        if (!combatStore.isInCombat()) {
          return;
        }

        return runTurnForOpponent();
      })
      .then(() => {
        if (combatStore.isInCombat()) {
          runCombatRounds();
        }
      })
      .catch(err => {
        throw err;
      });
  }
};

const runTurnForOpponent = () => {
  return new Promise((resolve, reject) => {
    startOpponentsTurn();

    // UX needs a delay between user action and opponent's
    // it doesn't have to be here, but this works pretty well
    setTimeout(() => {
      try {
        const attacks = combatStore.getOpponentsAttacks();
        const action = chooseOpponentsAction(attacks);

        switch (action.type) {
          case COMBAT_ACTION_ATTACK:
            attackCharacter(action.attack);
            resolve();
            break;

          default:
            throw new TypeError("Unrecognized combat action type");
        }
      } catch (err) {
        reject(err);
      }
    }, DELAY_BETWEEN_TURNS_MS);
  });
};

// @todo build some modicum of intelligence into this --
// when do they try to run/heal/change attack strategy?
// Maybe predefined tiers of cleverness, monster data
// could specify a monster's tier
const chooseOpponentsAction = attacks => {
  // @todo support running, magic, items
  const attackList = Object.keys(attacks);
  if (attackList.length === 0) {
    throw new ReferenceError("opponent has no attacks");
  }
  let attackName;
  if (attackList.length === 1) {
    attackName = attackList[0];
  } else {
    const index = getRandomNum(attackList.length - 1);
    attackName = attackList[index];
  }

  const attack = attacks[attackName];
  const action = {
    type: COMBAT_ACTION_ATTACK,
    attack
  };
  return action;
};

/**
 * Relies on user input for triggering their action, user
 * actions will end turn, so we poll for the character's
 * turn to be done. There is probably a more elegant way
 */
const runTurnForCharacter = () => {
  return new Promise((resolve, reject) => {
    startCharactersTurn();
    let isCharactersTurn = combatStore.isCharactersTurn();

    const charTurnCheck = setInterval(() => {
      if (!combatStore.isCharactersTurn()) {
        clearInterval(charTurnCheck);
        resolve();
      }
    }, POLLING_INTERVAL_FOR_CHAR_ACTION);
  });
};

// @todo does this belong here?
export const tileHasUndefeatedOpponents = tile => {
  const tilename = tile.getName();
  const monsters = tile.getMonsters() || [];
  const thereAreMonsters =
    monsters.length &&
    !playHistoryStore.getTileEvent(tilename, "opponentsDefeated");

  return thereAreMonsters;
};

export const getCharactersTotalAccuracy = () => {
  const charAccuracy = characterStore.getAccuracy();
  const selectedWeapon = inventoryStore.getActiveWeapon();
  // @todo active armor modifiers also
  const totalAccuracy = charAccuracy + selectedWeapon.getAccuracyMod();
  return totalAccuracy;
};

const getOpponentsTotalAccuracy = attack => {
  const opponentAccuracy = combatStore.getOpponentsAccuracy();
  const attackMod = attack.getAccuracyMod();
  return opponentAccuracy + attackMod;
};

/**
 * Coordinates an opponent attack on the character
 * @param  {OpponentAttack} attack An OpponentAttack representing
 *                                 the attack being used
 */
export const attackCharacter = attack => {
  const charEvasion = characterStore.getEvasion();
  const totalAccuracy = getOpponentsTotalAccuracy(attack);

  const hitSucceeded = doesAttackHit(totalAccuracy, charEvasion);

  if (hitSucceeded) {
    handleHitToCharacter(attack);
  } else {
    handleMissToCharacter();
  }
};

export const attackOpponent = () => {
  const totalAccuracy = getCharactersTotalAccuracy();

  const hitSucceeded = doesAttackHit(
    totalAccuracy,
    combatStore.getOpponentsEvasion()
  );
  if (hitSucceeded) {
    handleHitToOpponent();
  } else {
    handleMissToOpponent();
  }
};

export const handleHitToOpponent = () => {
  const opponentName = combatStore.getOpponentsName();
  const dmg = getDmgDealtByCharacter();
  const defense = getOpponentsDefense();

  const modifiedDmg = calculateModifiedDmg(dmg, defense);
  damageOpponent(modifiedDmg);

  showGameMsg(`Did ${modifiedDmg} damage!`);

  if (combatStore.areOpponentsDefeated()) {
    const treasure = combatStore.getTreasure();
    disburseTreasure(treasure);

    const tileName = characterStore.getCurrTileName();
    addToPlayHistory({
      eventName: "opponentsDefeated",
      tileName
    });

    showGameMsg(`${opponentName} defeated!`);

    endCombat();
  }
};

/**
 * Does all the things when an opponent hits a character
 * @param  {OpponentAttack} attack
 */
export const handleHitToCharacter = attack => {
  const opponentName = combatStore.getOpponentsName();
  const dmg = getDmgDealtByOpponent(attack);
  const defense = getCharactersDefense();

  const modifiedDmg = calculateModifiedDmg(dmg, defense);
  damageCharacter(modifiedDmg);

  showGameMsg(`${opponentName} did ${modifiedDmg} damage!`);

  // @todo handle zero health
};

export const getOpponentsDefense = () => {
  const armor = combatStore.getOpponentsArmor();
  const { protection, protectedAgainst, vulnerableTo } = armor;
  return new Defense({ protection, protectedAgainst, vulnerableTo });
};

export const getCharactersDefense = () => {
  const activeArmor = inventoryStore.getActiveArmor();
  const protection = activeArmor.getProtection();
  const protectedAgainst = activeArmor.getProtectedAgainst();
  const vulnerableTo = activeArmor.getVulnerableTo();
  return new Defense({ protection, protectedAgainst, vulnerableTo });
};

export const handleMissToOpponent = () => {
  showGameMsg("Missed!");
};

export const handleMissToCharacter = () => {
  const opponentName = combatStore.getOpponentsName();
  showGameMsg(`${opponentName} missed!`);
};

export const doesAttackHit = (attackerAccuracy, defenderEvasion) => {
  const rand = getRandomNum();
  if (rand - defenderEvasion + attackerAccuracy > HIT_CONST) {
    return true;
  }
  return false;
};

// @todo let some attacks use attrs other than Str as a modifier
// @todo get a Damage from weapon and derive a new Damage from it
export const getDmgDealtByCharacter = () => {
  const activeWeapon = inventoryStore.getActiveWeapon();
  const dmgTypes = activeWeapon.getDmgTypes();

  const weaponDmg = getRandomNum(activeWeapon.getDmg());
  const characterLevelDmgMod = getRandomNum(characterStore.getExpLevel());
  const characterStrMod = characterStore.getStr();

  const baseDmgDealt = weaponDmg + characterLevelDmgMod + characterStrMod;
  return new Damage({ dmgPoints: baseDmgDealt, types: dmgTypes });
};

/**
 * @param  {OpponentAttack} attack
 * @return {Damage}
 */
export const getDmgDealtByOpponent = attack => {
  const dmgTypes = attack.getDmgTypes();

  const attackDmg = getRandomNum(attack.getDmgPoints());
  const opponentLevelDmgMod = getRandomNum(combatStore.getOpponentsLevel());
  const opponentStrMod = combatStore.getOpponentsStr();

  const baseDmgDealt = attackDmg + opponentLevelDmgMod + opponentStrMod;
  return new Damage({ dmgPoints: baseDmgDealt, types: dmgTypes });
};

/**
 * Starting with a basic Dmg, applies modifiers based on protection/
 * vulnerability
 * @param  {Damage} dmg     Dmg object
 * @param  {Defense} defense Defense object
 * @return {Number}         Damage done taking into account protection/
 *                          vulnerability
 */
export const calculateModifiedDmg = (dmg, defense) => {
  const dmgPoints = dmg.getDmgPoints();
  const dmgTypes = dmg.getTypes();
  const protection = defense.getProtection();

  // protection takes precedence over vulnerability
  const isProtected = defense.isProtectedAgainst(dmgTypes);
  const isVulnerable = !isProtected && defense.isVulnerableTo(dmgTypes);

  let modifiedDmg = dmgPoints;
  if (isProtected) {
    modifiedDmg = modifiedDmg * combatConstants.DMG_PROTECTED_MOD;
  } else if (isVulnerable) {
    modifiedDmg = modifiedDmg * combatConstants.DMG_VULNERABLE_MOD;
  }

  modifiedDmg = modifiedDmg - protection;
  return modifiedDmg;
};

export const disburseTreasure = treasures => {
  treasures.forEach(treasure => {
    const messages = treasure.getReceivedMessages();
    const toInventory = treasure.getItemsForInventory();

    showGameMsg(messages, MSG_SPEED_MED);
    addToInventory(toInventory);
  });
};
