import { showGameMsg } from '../actions/actions-messages';
import { addToInventory } from '../actions/actions-inventory';
import { damageOpponent, endCombat } from '../actions/actions-combat';
import { addToPlayHistory } from '../actions/actions-playhistory';
import { playHistoryStore } from '../stores/store-play-history';

import { combatStore } from '../stores/store-combat';
import { characterStore } from '../stores/store-character';
import { inventoryStore } from '../stores/store-inventory';

import { Damage } from '../models/model-damage';

import { getRandomNum } from './util';

const HIT_CONST = 10;

export const tileHasUndefeatedOpponents = (tile) => {
  const tilename = tile.getName();
  const monsters = tile.getMonsters() || [];
  const thereAreMonsters = monsters.length && 
    !playHistoryStore.getTileEvent(tilename, 'opponentsDefeated');

  return thereAreMonsters;
};

export const getCurrTotalAccuracy = () => {
  const charAccuracy = characterStore.getAccuracy();
  const selectedWeapon = inventoryStore.getActiveWeapon();
  // @todo active armor modifiers also
  const totalAccuracy = charAccuracy + selectedWeapon.getAccuracyMod();
  return totalAccuracy;
};

export const attackOpponent = () => {
  const totalAccuracy = getCurrTotalAccuracy();

  const hitSucceeded = doesAttackHit( totalAccuracy, combatStore.getOpponentsEvasion() );
  if (hitSucceeded) {
    handleHit();
  } else {
    handleMiss();
  }
};

export const handleHit = () => {
  const dmg = getDmgDealt();
  const modifiedDmg = calculateModifiedDmg(dmg);
  damageOpponent(modifiedDmg);

  // @todo can we know the dmg amount here if the type 
  // dictates how much dmg is inflicted on the opponent?
  showGameMsg(`Did ${modifiedDmg} damage!`);

  if (combatStore.areOpponentsDefeated()) {
    const treasure = combatStore.getTreasure();
    disburseTreasure(treasure);

    const tileName = characterStore.getCurrTileName();
    addToPlayHistory({
      eventName: 'opponentsDefeated',
      tileName
    });

    showGameMsg('Opponents defeated!');

    endCombat();
  }
}

export const handleMiss = () => {
  showGameMsg('Missed!');
};

export const doesAttackHit = (attackerAccuracy, defenderEvasion) => {
  const rand = getRandomNum();
  if (rand - defenderEvasion + attackerAccuracy > HIT_CONST) {
    return true;
  }
  return false;
};

export const getDmgDealt = () => {
  const activeWeapon = inventoryStore.getActiveWeapon();
  const dmgTypes = activeWeapon.getDmgTypes();

  const weaponDmg = getRandomNum(activeWeapon.getDmg());
  const characterLevelDmgMod = getRandomNum(characterStore.getExpLevel());
  const characterStrMod = characterStore.getStr();

  const baseDmgDealt = weaponDmg + characterLevelDmgMod + characterStrMod;
  return new Damage({ dmgPoints: baseDmgDealt, types: dmgTypes});
};

export const calculateModifiedDmg = (dmg) => {
  const dmgPoints = dmg.getDmgPoints();
  const dmgTypes = dmg.getTypes();

  const armor = combatStore.getOpponentsArmor();
  const { protection, protectedAgainst, vulnerableTo } = armor;

  const isProtected = dmgTypes.reduce((acc, dmgType) => {
    return acc || protectedAgainst.includes(dmgType);
  }, false);
  let isVulnerable = false;
  if (!isProtected) {
    isVulnerable = dmgTypes.reduce((acc, dmgType) => {
      return acc || vulnerableTo.includes(dmgType);
    }, false);
  }

  let modifiedDmg = dmgPoints;
  if (isProtected) {
    modifiedDmg = modifiedDmg * combatConstants.DMG_PROTECTED_MOD;
  } else if (isVulnerable) {
    modifiedDmg = modifiedDmg * combatConstants.DMG_VULNERABLE_MOD;
  }

  modifiedDmg = modifiedDmg - protection;
  return modifiedDmg;
}

export const disburseTreasure = (treasures) => {
  treasures.forEach((treasure) => {
    const messages = treasure.getReceivedMessages();
    const toInventory = treasure.getItemsForInventory();

    showGameMsg(messages);
    addToInventory(toInventory);
  });
};