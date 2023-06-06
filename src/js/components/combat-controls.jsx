import React, { useCallback } from "react";

import { endCharactersTurn, attackOpponent } from "../actions/combat";

import "../../css/components/combat-controls";

/**
 * @todo support Magic, Run and Item options
 */
export const CombatControls = () => {
  // @todo this component should just accept handlers for actions
  const handleAttackClick = useCallback(() => {
    attackOpponent();
    endCharactersTurn();
  });

  return (
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
};
