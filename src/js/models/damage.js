function isValidOpts(opts) {
  if (
    typeof opts !== "object" ||
    !opts ||
    typeof opts.dmgPoints !== "number" ||
    isNaN(opts.dmgPoints) ||
    typeof opts.types !== "object" ||
    !opts.types ||
    typeof opts.types.length !== "number"
  ) {
    return false;
  }

  return true;
}

export default class Damage {
  constructor(opts) {
    if (!isValidOpts(opts)) {
      throw new TypeError("Invalid opts passed to Damage constructor");
    }

    this.dmgPoints = opts.dmgPoints;
    this.types = opts.types;
  }

  getTypes() {
    return this.types;
  }

  getDmgPoints() {
    return this.dmgPoints;
  }
}
