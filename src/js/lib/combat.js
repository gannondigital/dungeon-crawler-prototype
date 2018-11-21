import { showGameMsg } from '../actions/actions-messages';
import { addToInventory } from '../actions/actions-inventory';

export const disburseTreasure = (treasureArr) => {
  const messages = [];
  const toInventory = [];
  treasureArr.forEach((treasure) => {
    messages.push(treasure.getReceivedMessage());
    toInventory.push(treasure.getInventory());
  });

  showGameMsg(messages);


};