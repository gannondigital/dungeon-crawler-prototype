import React, { Component } from 'react';

export class CombatControls extends Component {

  constructor(props) {
    super(props);

    this.handleAttackClick = this.handleAttackClick.bind(this);
  }

  handleAttackClick() {
    
  }

  render() {

    return (
      <ul className="combat-controls">
        <li>
          <button className="combat-controls--attack" onClick={this.handleAttackClick}>Attack</button>
        </li>
        <li>
          <button className="combat-controls--magic">Magic</button>
        </li>
        <li>
          <button className="combat-controls--run">Run</button>
        </li>
      </ul>
    );
  }

}