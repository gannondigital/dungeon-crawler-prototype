

// stats:
//   health
// treasure:
//   gold
//   items
// attacks
//   hit %
//   damage #
// meta
//   img
//   name 
//   type
//   lore

export class Monster {

  constructor(monsterProps) {
    const isValid = validateProps(monsterProps);
    if (!isValid) {
      throw new TypeError('Invalid props passed to Monster constructor');
    }
    this.initialize()

    this.meta.img_url = 'monster-placeholder.png';
  }

  initialize() {
    this.stats = {};
    this.treasure = {};
    this.attacks = {};
    this.meta = {};
  }

  getImageUrl() {
    return this.meta.img_url;
  }

}

function validateProps(monsterProps) {

}