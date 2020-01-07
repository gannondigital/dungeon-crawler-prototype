import { Damage } from "./model-damage";

export default class OpponentAttack {
  constructor(attackProps) {
    const isValid = isValidAttackProps(attackProps);
    if (!isValid) {
      throw new TypeError("Invaid props passed to OpponentAttack");
    }
    this.data = attackProps;
  }

  getDmgTypes() {
    return this.data.dmg.getTypes();
  }

  getDmgPoints() {
    return this.data.dmg.getDmgPoints();
  }

  getAccuracyMod() {
    return this.data.accuracyMod;
  }
}

const isValidAttackProps = attackProps => {
  let isValid = true;
  const required = ["dmg", "accuracyMod"];
  required.forEach(propName => {
    if (typeof attackProps[propName] === "undefined") {
      isValid = false;
    }
  });

  if (isValid) {
    const { dmg, accuracyMod } = attackProps;
    if (!(dmg instanceof Damage)) {
      isValid = false;
    }

    if (typeof accuracyMod !== "number" || isNaN(accuracyMod)) {
      isValid = false;
    }
  }

  return isValid;
};
