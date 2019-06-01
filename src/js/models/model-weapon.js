import Item from "./model-item";

export class Weapon extends Item {
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

  }

  getDmgTypes() {

  }

  getAccuracyMod() {

  }

  getEvasionMod() {

  }
}

function validateProps(props) {
  if (typeof props.dmg !== "number" || isNan(props.dmg)) {
    return false;
  }

  if (typeof props.dmgTypes !== "object" || !props.dmgTypes || 
    typeof props.dmgTypes.length !== "number") {
    return false;
  }

  if (typeof props.accuracyMod !== "number" || isNan(props.accuracyMod)) {
    return false;
  }

  if (typeof props.evasionMod !== "number" || isNan(props.evasionMod)) {
    return false;
  }

  return true;
}