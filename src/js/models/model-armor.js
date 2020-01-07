import Item from "./model-item";

export default class Armor extends Item {
  constructor(props) {
    super(props);

    const {
      protection,
      protectedAgainst,
      vulnerableTo,
      evasionMod,
      accuracyMod
    } = props;

    if (!validateProps(props)) {
      throw new TypeError("Invalid props passed to Armor constructor");
    }

    this.data = {
      protection,
      protectedAgainst,
      vulnerableTo,
      evasionMod,
      accuracyMod
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

  getEvasionMod() {
    return this.data.evasionMod;
  }

  getAccuracyMod() {
    return this.data.accuracyMod;
  }
}

function validateProps(props) {
  const {
    protection,
    protectedAgainst,
    vulnerableTo,
    evasionMod,
    accuracyMod
  } = props;
  if (typeof protection !== "number" || isNaN(protection)) {
    return false;
  }

  if (!Array.isArray(protectedAgainst)) {
    return false;
  }

  if (!Array.isArray(vulnerableTo)) {
    return false;
  }

  if (typeof evasionMod !== "number" || isNaN(evasionMod)) {
    return false;
  }
  if (typeof accuracyMod !== "number" || isNaN(accuracyMod)) {
    return false;
  }

  return true;
}
