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

import Treasure from "../models/treasure";
import OpponentAttack from "../models/opponent-attack";
import combatConstants from "../constants/combat";

const placeholderImg = require("../../img/monster-placeholder.png");

function validateProps({
  meta,
  armor,
  attacks,
  attr,
  expLevel,
  stats,
  treasure,
  initialStatus,
}) {
  return (
    validateMeta(meta) &&
    validateAttacks(attacks) &&
    typeof expLevel === "number" &&
    !isNaN(expLevel) &&
    treasure instanceof Treasure
  );
  // @todo
}

function validateMeta(monsterMeta) {
  return (
    monsterMeta &&
    typeof monsterMeta === "object" &&
    monsterMeta.name &&
    typeof monsterMeta.name === "string" &&
    monsterMeta.label &&
    typeof monsterMeta.label === "string"
  );
}

/**
 * Validates attack data, which should be a obj of OpponentAttacks
 * keyed by attack name.
 * @param  {Object} monsterAttacks OpponentAttack objects keyed on attack name
 * @return {Boolean}
 */
function validateAttacks(monsterAttacks) {
  return Object.values(monsterAttacks).reduce((isValid, attack) => {
    return isValid && attack instanceof OpponentAttack;
  }, true);
}

export default class Monster {
  // @todo DRY up prop names
  constructor({
    meta,
    armor,
    attacks,
    attr,
    expLevel,
    stats,
    treasure,
    initialStatus,
  }) {
    const isValid = validateProps({
      meta,
      armor,
      attacks,
      attr,
      expLevel,
      stats,
      treasure,
      initialStatus,
    });
    if (!isValid) {
      throw new TypeError("Invalid props passed to Monster constructor");
    }

    this.attr = attr;
    this.stats = stats;
    // allow initial health to be the default max
    // @todo varying initital health values
    this.stats.health = this.stats.health || this.stats.maxHealth;
    this.treasure = treasure;
    this.attacks = attacks;
    this.armor = armor;
    this.meta = meta;
    this.status = {
      isDefeated: false,
    };
  }

  getImageUrl() {
    return this.meta.imgUrl;
  }

  /**
   * @returns {Number}
   */
  getExpLevel() {
    return this.expLevel;
  }

  /**
   * Returns code-friendly, unique name of monster
   * @returns {String}
   */
  getName() {
    return this.meta.name;
  }

  /**
   * @returns {String} Human-friendly name of monster
   */
  getLabel() {
    return this.meta.label;
  }

  /**
   * Subtracts dmg from health, updates isDefeated as needed
   * @param {Number} dmg
   */
  takeDamage(dmg) {
    if (typeof dmg !== "number") {
      throw new TypeError("Invalid damage passed to takeDamage");
    }

    // cap at zero health
    this.stats.health = this.stats.health - dmg;
    if (this.stats.health < 0) {
      this.stats.health = 0;
    }

    // @todo this is a good place to hook in heal/save mechanic

    if (this.stats.health === 0) {
      this.status.isDefeated = true;
    }
  }

  /**
   * @returns {Boolean}
   */
  isDefeated() {
    return this.status.isDefeated;
  }

  /**
   * @returns {Treasure}  monster's treasure
   */
  getTreasure() {
    return this.treasure;
  }

  /**
   * @returns {Number}
   */
  getStr() {
    return this.attr.str;
  }

  /**
   * @todo why getEvasion when the attr is dex?
   * @returns {Number}
   */
  getEvasion() {
    return this.attr.dex;
  }

  /**
   * @returns {Number}
   */
  getAccuracy() {
    return this.attr.accuracy;
  }

  /**
   * @returns {Number}
   */
  getArmor() {
    return this.armor;
  }

  /**
   *
   * @returns {Object} Dictionary of OpponentAttacks, keyed by name
   */
  getAttacks() {
    return this.attacks;
  }
}
