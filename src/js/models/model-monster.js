
// status:
//   isDefeated
// stats:
//   health
//   maxHealth
// treasure:
//   gold
//   items
// attacks
//   hit %
//   damage #
//   stamina
//   evasion
// meta
//   img
//   name 
//   type
//   lore

import { Damage } from '../models/model-damage';
import { Treasure } from '../models/model-treasure';

const placeholderImg = require('../../img/monster-placeholder.png');

export class Monster {

  constructor(monsterProps) {
    const isValid = validateProps(monsterProps);
    if (!isValid) {
      throw new TypeError('Invalid props passed to Monster constructor');
    }
    this.initialize(monsterProps)

    this.meta.img_url = placeholderImg;
  }

  initialize(props) {
    this.stats = props.stats;
    // allow initial health to be the default max
    this.stats.health = this.stats.health || this.stats.maxHealth;
    this.treasure = props.treasure;
    this.attacks = props.attacks;
    this.meta = props.meta;
    this.status = {
      isDefeated: false
    };
  }

  getImageUrl() {
    return this.meta.img_url;
  }

  getName() {
    return this.meta.name;
  }

  takeDamage(damage) {
    if (!(damage) instanceof Damage) {
      throw new TypeError('Invalid damage passed to takeDamage');
    }

    const dmgPoints = damage.getDmgPoints();
    const dmgType = damage.getType();

    // @todo account for different dmg types

    this.stats.health = this.stats.health - dmgPoints;
    if (this.stats.health < 0) {
      this.stats.health = 0;
    }
    if (this.stats.health === 0) {
      this.status.isDefeated = true;
    }
  }

  isDefeated() {
    return this.status.isDefeated;
  }

  // @todo return other types of treasure
  getTreasure() {
    let { items } = this.treasure;
    items = items ? items : [];

    return new Treasure({ items });
  }

}

function validateProps(monsterProps) {
  let isValid = true;
  isValid = validateMeta(monsterProps.meta);
  return isValid;
}

function validateMeta(monsterMeta) {
  return !!(monsterMeta && typeof monsterMeta === 'object' &&
    monsterMeta.name && typeof monsterMeta.name === 'string' &&
    monsterMeta.label && typeof monsterMeta.label === 'string');
}
