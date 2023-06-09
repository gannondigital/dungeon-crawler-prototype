import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { endCharactersTurn, attackOpponent } from "../actions/combat";

import "../../css/components/combat-controls";

const CombatControlsProvider = ({}) => {
  const handleAttackClick = useCallback(() => {
    attackOpponent();
    endCharactersTurn();
  });

  return <CombatControls handleAttackClick={handleAttackClick} />;
};
export default CombatControlsProvider;
/**
 * @todo support Magic, Run and Item options
 */
export const CombatControls = ({ handleAttackClick }) => (
  <ul className="combat-controls">
    <li>
      <button className="combat-controls--attack" onClick={handleAttackClick}>
        Attack
      </button>
    </li>
    <li>
      <button disabled>Magic</button>
    </li>
    <li>
      <button disabled>Run</button>
    </li>
    <li>
      <button disabled>Item</button>
    </li>
  </ul>
);
CombatControls.propTypes = {
  handleAttackClick: PropTypes.function,
};
