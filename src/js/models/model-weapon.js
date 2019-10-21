import Item from "./model-item";

// @todo should this be able to provide a Damage 
// instance? clarify boundaries
// we do need more than just this to get a final Damage
// but if Damage instances could easily be composed into 
// new Damage instances, it would make sense here
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