// @todo why do we have a model for this attack, but not
// one for the character's attack?
import Damage from "./damage";

/**
 * Responsible for validating model data
 * @param {Object} attackProps see constructor
 * @returns {Boolean}
 */
const isValidAttackProps = ({ dmg, accuracyMod }) => {
  return dmg instanceof Damage && typeof accuracyMod === 'number' &&
    !isNaN(accuracyMod);
};

export default class OpponentAttack {
  /**
   * @param {Object} attackProps 
   * @param {Damage} attackProps.dmg  A damage object representing the amount & type of dmg
   * @param {Number} attackProps.accuracyMod  Accuracy modifier for hit calculation
   */
  constructor(attackProps) {
    if (!isValidAttackProps(attackProps)) {
      throw new TypeError("Invalid props passed to OpponentAttack");
    }
    this.data = attackProps;
  }

  /**
   * @returns {Array<string>}
   */
  getDmgTypes() {
    return this.data.dmg.getTypes();
  }

  /**
   * @returns {Number}
   */
  getDmgPoints() {
    return this.data.dmg.getDmgPoints();
  }

  /**
   * @returns {Number}
   */
  getAccuracyMod() {
    return this.data.accuracyMod;
  }
}
