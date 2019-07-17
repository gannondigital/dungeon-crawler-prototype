import Item from "./model-item";

export default class Weapon extends Item {
  constructor(props) {
    super(props);

    if (!validateProps(props)) {
      throw new TypeError('Invalid props passed to Weapon constructor');
    }

    this.dmg = props.dmg;
    this.dmgTypes = props.dmgTypes;
    this.accuracyMod = props.accuracyMod;
    this.evasionMod = props.evasionMod;
  }

  getDmg() {
    return this.dmg;
  }

  getDmgTypes() {
    return this.dmgTypes;
  }

  getAccuracyMod() {
    return this.accuracyMod;
  }

  getEvasionMod() {
    return this.evasionMod;
  }
}

function validateProps(props) {
  if (typeof props.dmg !== "number" || isNaN(props.dmg)) {
    return false;
  }

  if (typeof props.dmgTypes !== "object" || !props.dmgTypes || 
    typeof props.dmgTypes.length !== "number") {
    return false;
  }

  if (typeof props.accuracyMod !== "number" || isNaN(props.accuracyMod)) {
    return false;
  }

  if (typeof props.evasionMod !== "number" || isNaN(props.evasionMod)) {
    return false;
  }

  return true;
}