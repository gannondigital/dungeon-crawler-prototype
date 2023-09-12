import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { endCharactersTurn, attackOpponent } from "../../../actions/combat";
import { useWindowKeydown } from "../../../hooks";
import { uiDelayedUpdate } from "../../../lib/util";
import { KEY_ATTACK } from "../../../constants";

import "../../../../css/components/Passage/Combat/combat-controls";

const CombatControlsProvider = ({}) => {
  const [activeButton, setActiveButton] = useState(null);
  const handleAttackClick = useCallback(() => {
    attackOpponent();
    endCharactersTurn();
  }, [attackOpponent, endCharactersTurn]);

  const handleWindowKeydown = useCallback(
    async (keyPressed) => {
      if (keyPressed === KEY_ATTACK) {
        setActiveButton("attack");
        await uiDelayedUpdate(() => {
          setActiveButton(null);
        });
        handleAttackClick();
      }
    },
    [handleAttackClick, setActiveButton]
  );

  useWindowKeydown(handleWindowKeydown);
  return (
    <CombatControls
      activeButton={activeButton}
      handleAttackClick={handleAttackClick}
    />
  );
};
export default CombatControlsProvider;
/**
 * @todo support Magic, Run and Use options
 */
export const CombatControls = ({ handleAttackClick, activeButton }) => {
  const attackClasses = classNames({
    "combat-controls__button": true,
    active: activeButton === "attack",
  }); // @todo same for other buttons when supported
  return (
    <ul className="combat-controls">
      <li>
        <button
          className={attackClasses}
          onClick={handleAttackClick}
          type="button"
        >
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
};
CombatControls.propTypes = {
  activeButton: PropTypes.string,
  handleAttackClick: PropTypes.func.isRequired,
};
