
// status:
//   isDefeated
// stats:
//   health
//   maxHealth
// treasure:
//   gold
//   items
// attr
//   str
//   dex
//   accuracy
// armor
//   protection
//   protectedAgainst
//   vulnerableTo
// attacks
//   dmg
//   dmgType
//   accuracyMod
// expLevel
// meta
//   img
//   name
//   label
//   type
//   lore

import { Treasure } from '../models/model-treasure';
import OpponentAttack from "../models/model-opponent-attack";
import combatConstants from '../config/constants-combat';

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
    this.attr = props.attr;
    this.stats = props.stats;
    // allow initial health to be the default max
    this.stats.health = this.stats.health || this.stats.maxHealth;
    this.treasure = props.treasure;
    this.attacks = props.attacks;
    this.armor = props.armor;
    this.meta = props.meta;
    this.status = {
      isDefeated: false
    };
  }

  getImageUrl() {
    return this.meta.img_url;
  }

  getExpLevel() {
    return this.expLevel;
  }

  /**
   * Returns code-friendly, unique name of monster
   * @return {[type]} [description]
   */
  getName() {
    return this.meta.name;
  }

  /**
   * Returns human-friendly name of monster
   */
  getLabel() {
    return this.meta.label;
  }

  takeDamage(dmg) {
    if (typeof dmg !== "number") {
      throw new TypeError('Invalid damage passed to takeDamage');
    }

    this.stats.health = this.stats.health - dmg;
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

  getStr() {
    return this.attr.str;
  }

  getEvasion() {
    return this.attr.dex;
  }

  getAccuracy() {
    return this.attr.accuracy;
  }

  getArmor() {
    return this.armor;
  }

  getAttacks() {
    return this.attacks;
  }

}

function validateProps(monsterProps) {
  let isValid = true;
  isValid = isValid && validateMeta(monsterProps.meta);
  isValid = isValid && validateAttacks(monsterProps.attacks);
  isValid = isValid && (typeof monsterProps.expLevel === "number" && !isNaN(monsterProps.expLevel));
  return isValid;
}

function validateMeta(monsterMeta) {
  return !!(monsterMeta && typeof monsterMeta === 'object' &&
    monsterMeta.name && typeof monsterMeta.name === 'string' &&
    monsterMeta.label && typeof monsterMeta.label === 'string');
}

/**
 * Validates attack data, which should be a obj of OpponentAttacks
 * keyed by attack name.
 * @param  {Object} monsterAttacks OpponentAttack objects keyed on attack name
 * @return {Boolean}
 */
function validateAttacks(monsterAttacks) {
  let isValid = true;
  Object.values(monsterAttacks).forEach(attackObj => {
    if ( !(attackObj instanceof OpponentAttack ) ) {
      isValid = false;
    }
  });
  return isValid;
}
