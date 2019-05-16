import { showGameMsg } from '../actions/actions-messages';
import { addToInventory } from '../actions/actions-inventory';
import { damageOpponent, endCombat } from '../actions/actions-combat';
import { addToPlayHistory } from '../actions/actions-playhistory';
import { playHistoryStore } from '../stores/store-play-history';

import { combatStore } from '../stores/store-combat';
import { characterStore } from '../stores/store-character';

import { Damage } from '../models/model-damage';

export const tileHasUndefeatedOpponents = (tile) => {
  const tilename = tile.getName();
  const monsters = tile.getMonsters() || [];
  const thereAreMonsters = monsters.length && 
    !playHistoryStore.getTileEvent(tilename, 'opponentsDefeated');

  return thereAreMonsters;
};

export const attack = ({ dmg, hitValue }) => {
  if (!(dmg instanceof Damage) || !hitValue || typeof hitValue !== 'number') {
    throw new ReferenceError('Invalid dmg/hitValue passed to attack');
  }
  // @todo don't always hit
  const hitSucceeded = true;

  damageOpponent(dmg);

  // @todo can we know the dmg amount here if the type 
  // dictates how much dmg is inflicted on the opponent?
  showGameMsg(`Did ${dmg.getDmgPoints()} damage!`);

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
};

export const disburseTreasure = (treasures) => {
  treasures.forEach((treasure) => {
      const messages = treasure.getReceivedMessages();
      const toInventory = treasure.getItemsForInventory();

      showGameMsg(messages);
      addToInventory(toInventory);
  });
};