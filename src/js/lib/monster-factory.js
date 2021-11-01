import Monster from "../models/monster";
import Damage from "../models/damage";
import OpponentAttack from "../models/opponent-attack";
import TreasureFactory from "./treasure-factory";
import monstersStore from "../stores/monsters";

/**
 * @todo does this still make sense as a pattern
 * Replaces the raw attack data's dmg values with a Damage object
 * @param  {Object} rawAttackData Raw JSON object of a monster's attacks, keyed on name
 * @return {Object}               Similar object, with dmgPoints and types replaced by
 *                                a `dmg` object
 */
 function getAttacksForMonster(rawAttackData) {
  const attackObjs = {};
  for (const attackName in rawAttackData) {
    if (!rawAttackData.hasOwnProperty(attackName)) {
      continue;
    }

    const { dmgPoints, types, accuracyMod } = rawAttackData[attackName];
    const dmg = new Damage({
      dmgPoints,
      types
    });
    attackObjs[attackName] = new OpponentAttack({
      dmg,
      accuracyMod
    });
  }
  return attackObjs;
}

/**
 * Composes the necessary data to make a monster; responsible for
 * retrieving the raw monster data. 
 * @param  {String} monsterName name of monster in level data
 * @return {Monster}              Instance of Monster model
 */
export const MonsterFactory = monsterName => {
  // @todo this should not be a store lookup
  const monsterData = monstersStore.getMonster(monsterName);

  const {
    treasure: monsterDataTreasure,
    attacks: monsterDataAttacks
  } = monsterData;

  const treasure = TreasureFactory(monsterDataTreasure);
  const attacks = getAttacksForMonster(monsterDataAttacks);
  return new Monster({
    ...monsterData,
    treasure,
    attacks
  });
};
