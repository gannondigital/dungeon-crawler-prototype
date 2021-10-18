import React, { Component } from "react";

import { endCharactersTurn, attackOpponent } from "../actions/combat";

import "../../css/components/combat-controls";

/**
 * @todo support Magic, Run and Item options
 */
export class CombatControls extends Component {
  constructor(props) {
    super(props);

    this.handleAttackClick = this.handleAttackClick.bind(this);
  }

  // @todo this component should just accept handlers for actions
  handleAttackClick() {
    attackOpponent();
    endCharactersTurn();
  }

  render() {
    return (
      <ul className="combat-controls">
        <li>
          <button
            className="combat-controls--attack"
            onClick={this.handleAttackClick}
          >
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
  }
}
