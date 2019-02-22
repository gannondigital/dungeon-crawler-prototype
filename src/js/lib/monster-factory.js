import { Monster } from '../models/model-monster';
import { Treasure } from '../models/model-treasure';
import { itemsStore } from '../stores/store-items';

/**
 * Composes the necessary data to make a monster. Takes the monster's
 * treasure.items and hydrates it into an array of actual item objects.
 * @param  {Object} monsterProps Monster data, from store/level data
 * @return {Monster}              Instance of Monster model
 */
export const MonsterFactory = (monsterProps) => {

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
  const items = itemsStore.getItems(itemNameArr);
  return items;
}