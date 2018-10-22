import { Tile } from '../models/model-tile';
import { monsterStore } from '../stores/store-monsters.js';

export const TileFactory = (tileProps) => {
  const {
    tileId
  } = tileProps;
  const monstArr = tileProps.monsters || [];
  const monsters = getMonstersForTile(monstArr);
  return new Tile({...tileProps, monsters});
};

// instantiates Monster objects for each named monster in tile
function getMonstersForTile(monstArr) {
  const monsters = monstArr.map((monsterName) => {
    return monsterStore.getMonster(monsterName);
  });
  return monsters;
}