import { showGameMsg } from '../actions/actions-messages';
import { addToInventory } from '../actions/actions-inventory';
import { playHistoryStore } from '../stores/store-play-history';

export const tileHasUndefeatedOpponents = (tile) => {
  const tilename = tile.getName();
  const monsters = tile.getMonsters() || [];
  const thereAreMonsters = monsters.length && 
    !playHistoryStore.getTileEvent(tilename, 'opponentsDefeated');

  return thereAreMonsters;
};

export const disburseTreasure = (treasureArr) => {
  const messages = [];
  const toInventory = [];
  treasureArr.forEach((treasure) => {
    messages.push(treasure.getReceivedMessage());
    toInventory.push(treasure.getInventory());
  });

  showGameMsg(messages);


};