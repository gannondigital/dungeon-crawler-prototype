import { showGameMsg } from '../actions/actions-messages';
import { addToInventory } from '../actions/actions-inventory';
import { damageOpponent, endCombat } from '../actions/actions-combat';
import { addToPlayHistory } from '../actions/actions-playhistory';
import { playHistoryStore } from '../stores/store-play-history';

import { combatStore } from '../stores/store-combat';
import { characterStore } from '../stores/store-character';

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

export const attack = ({ dmg, accuracy }) => {
  if (!(dmg instanceof Damage) || !accuracy || typeof accuracy !== 'number') {
    throw new ReferenceError('Invalid dmg/accuracy passed to attack');
  }
  // @todo don't always hit
  const hitSucceeded = doesAttackHit( accuracy, combatStore.getOpponentsEvasion() );
  if (hitSucceeded) {
    handleHit(dmg);
  } else {
    handleMiss();
  }
};

export const handleHit = (dmg) => {
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

export const disburseTreasure = (treasures) => {
  treasures.forEach((treasure) => {
    const messages = treasure.getReceivedMessages();
    const toInventory = treasure.getItemsForInventory();

    showGameMsg(messages);
    addToInventory(toInventory);
  });
};