import { Monster } from '../models/model-monster';
import { Treasure } from '../models/model-treasure';

export const MonsterFactory = (monsterProps) => {

  const treasureArr = monsterProps.treasure || [];
  const treasure = getTreasureForMonster(treasureArr);
  return new Monster({...monsterProps, treasure});
};

// instantiates Monster objects for each named monster in tile
function getTreasureForMonster(treasureArr) {
  const treasure = treasureArr.map((treasureProps) => {
    return new Treasure(treasureProps);
  });
  return treasure;
}