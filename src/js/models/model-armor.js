import Item from './model-item';

export default class Armor extends Item {

  constructor(props) {
    super(props);

    if (!validateProps(props)) {
      throw new TypeError('Invalid props passed to Armor constructor');
    }

    this.protection = props.protection;
    this.protectsAgainst = props.protectsAgainst;
    this.vulnerableTo = props.vulnerableTo;
    this.evasionMod = props.evasionMod;
    this.accuracyMod = props.accuracyMod;
  }

  getProtection() {

  }

  getProtectsAgainst() {

  }

  getVulnerableTo() {

  };

  getEvasionMod() {

  };

  getAccuracyMod() {

  }
 
}

function validateProps(props) {
  if (typeof props.protection !=='number' || isNaN(props.protection)) {
    return false;
  } 

  if (typeof props.protectsAgainst !==  "object" || !props.getProtectsAgainst || typeof props.protectsAgainst.length !== "number" ) {
    return false;
  }
  if (typeof props.vulnerableTo !== "object" || !props.vulnerableTo || typeof props.vulnerableTo.length !== "number" ) {
    return false;
  }
  if (typeof props.evasionMod !=='number' || isNaN(props.evasionMod)) {
    return false;
  
  }
  if (typeof props.accuracyMod !=='number' || isNaN(props.accuracyMod)) {
    return false;
  }

  return true;
}