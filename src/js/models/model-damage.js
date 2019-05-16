export class Damage {
  constructor(opts) {
    if (!isValidOpts(opts)) {
      throw new TypeError('Invalid opts passed to Damage constructor');
    }

    this.dmgPoints = opts.dmgPoints;
    this.type = opts.type;
  }

  getType() {
    return this.type;
  }

  getDmgPoints() {
    return this.dmgPoints;
  }
}

function isValidOpts(opts) {
  if (typeof opts !== 'object' || !opts ||
    typeof opts.dmgPoints !== 'number' || isNaN(opts.dmgPoints) || 
    typeof opts.type !== 'string' || !opts.type) {
    return false;
  }

  return true;
}
