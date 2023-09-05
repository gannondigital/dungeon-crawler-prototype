import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { endCharactersTurn, attackOpponent } from "../../../actions/combat";
import { useWindowKeydown } from '../../../hooks';
import { KEY_ATTACK } from '../../../constants';

import "../../../../css/components/Passage/Combat/combat-controls";

const CombatControlsProvider = ({}) => {
  const handleAttackClick = useCallback(() => {
    attackOpponent();
    endCharactersTurn();
  }, [attackOpponent, endCharactersTurn]);

  const buttonDoneClicked = () => {
    handleAttackClick();
  }

  const handleWindowKeydown = useCallback((keyPressed) => {
    if (keyPressed === KEY_ATTACK) {
      handleAttackClick();
    }
  }, [handleAttackClick]);

  useWindowKeydown(handleWindowKeydown);

  return <CombatControls handleAttackClick={buttonDoneClicked} />;
};
export default CombatControlsProvider;
/**
 * @todo support Magic, Run and Use options
 */
export const CombatControls = ({ handleAttackClick }) => (
  <ul className="combat-controls">
    <li>
      <button onClick={handleAttackClick} type="button">
        Attack
      </button>
    </li>
    <li>
      <button disabled>Magic</button>
    </li>
    <li>
      <button disabled>Use</button>
    </li>
    <li>
      <button disabled>Run</button>
    </li>
    
  </ul>
);
CombatControls.propTypes = {
  handleAttackClick: PropTypes.func,
};
