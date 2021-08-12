import Monster from "../models/monster";
import Treasure from "../models/treasure";
import Damage from "../models/damage";
import OpponentAttack from "../models/opponent-attack";
import itemsStore from "../stores/items";

/**
 * Composes the necessary data to make a monster. Takes the monster's
 * treasure.items and hydrates it into an array of actual item objects.
 * @param  {Object} monsterProps Monster data, from store/level data
 * @return {Monster}              Instance of Monster model
 */
export const MonsterFactory = monsterProps => {
  const treasureObj = monsterProps.treasure || {
    // @todo could include other treasure besides `items`
    items: []
  };
  const items = getTreasureForMonster(treasureObj);
  const newMonsterProps = Object.assign(monsterProps, {
    treasure: {
      items
    }
  });
  const attacks = getAttacksForMonster(monsterProps.attacks);
  newMonsterProps.attacks = attacks;
  return new Monster(newMonsterProps);
};

/**
 * Returns the complete item objects specified by the monster's
 * treasure.items, from the store.
 * @todo  support non-item treasure
 * @param  {Object} treasureObj items: array of item names, corresponding
 *                              to items in the store/level data
 * @return {Array}             Array of item objects
 */
function getTreasureForMonster(treasureObj) {
  const itemNameArr = treasureObj.items;
  return itemNameArr.length ? itemsStore.getItems(itemNameArr) : []
}

/**
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
