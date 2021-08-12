// @todo standardize & DRY up non-React argument validation
const arePropsValid = props => {
  if (
    typeof props.protection !== "number" ||
    !Array.isArray(props.protectedAgainst) ||
    !Array.isArray(props.vulnerableTo)
  ) {
    return false;
  }
  return true;
};

export default class Defense {
  constructor(props) {
    if (!arePropsValid(props)) {
      throw new TypeError("Invalid props passed to Defense constructor");
    }

    const { protection, protectedAgainst, vulnerableTo } = props;

    this.data = {
      protection,
      protectedAgainst,
      vulnerableTo
    };
  }

  getProtection() {
    return this.data.protection;
  }

  getProtectedAgainst() {
    return this.data.protectedAgainst;
  }

  getVulnerableTo() {
    return this.data.vulnerableTo;
  }

  /**
   * @param  {Array}  dmgTypes Array of attack type strings
   * @return {Boolean}
   */
  isProtectedAgainst(dmgTypes) {
    return dmgTypes.reduce((acc, dmgType) => {
      return acc || this.data.protectedAgainst.includes(dmgType);
    }, false);
  }

  /**
   * @param  {Array}  types Array of attack type strings
   * @return {Boolean}
   */
  isVulnerableTo(dmgTypes) {
    return dmgTypes.reduce((acc, dmgType) => {
      return acc || this.data.vulnerableTo.includes(dmgType);
    }, false);
  }
}
