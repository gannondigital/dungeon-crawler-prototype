

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
    this.treasure = props.treasure;
    this.attacks = props.attacks;
    this.meta = props.meta;
  }

  getImageUrl() {
    return this.meta.img_url;
  }

  getName() {
    return this.meta.name;
  }

  takeDamage({dmg, dmgType}) {
    this.stats.health = this.stats.health - dmg;
    
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
