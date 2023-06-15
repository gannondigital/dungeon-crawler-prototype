/**
 * @returns {Boolean}
 */
function isValidDmgProps({ dmgPoints, types }) {
  return (
    dmgPoints &&
    types &&
    typeof dmgPoints === "number" &&
    Array.isArray(types) &&
    types.reduce((isValid, dmgType) => {
      return isValid && typeof dmgType === "string";
    }, true)
  );
}

export default class Damage {
  /**
   * @param {Object} dmgProps
   * @param {Number} dmgProps.dmgPoints Amount of damage potentially done
   * @param {Array<string>} dmgProps.types Array of damage types the damage does
   */
  constructor(dmgProps) {
    if (!isValidDmgProps(dmgProps)) {
      throw new TypeError("Invalid dmgProps passed to Damage constructor");
    }

    this.dmgPoints = dmgProps.dmgPoints;
    this.types = dmgProps.types;
  }

  getTypes() {
    return this.types;
  }

  getDmgPoints() {
    return this.dmgPoints;
  }
}
