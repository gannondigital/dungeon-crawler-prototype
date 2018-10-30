import React, { Component } from 'react';

import { attack } from '../actions/actions-combat';
import { characterStore } from '../stores/store-character';
//import { inventoryStore } from '../stores/store-inventory';

export class CombatControls extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dmg: 0,
      hitValue: 0
    };

    this.handleAttackClick = this.handleAttackClick.bind(this);
    this.handleCharacterUpdate = this.handleCharacterUpdate.bind(this);
    //this.handleInventoryUpdate = this.handleInventoryUpdate.bind(this);
  }

  componentWillMount() {
    characterStore.listen(this.handleCharacterUpdate);
    //inventoryStore.listen(this.handleInventoryUpdate);
  }

  componentWillUnmount() {
    characterStore.stopListening(this.handleCharacterUpdate);
    //inventoryStore.stopListening(this.handleInventoryUpdate);
  }

  handleAttackClick() {
    const { dmg, hitValue } = this.state;
    attack({
      dmg,
      hitValue
    });
  }

  handleCharacterUpdate() {
    const hitValue = characterStore.getHitVal();
    const dmg = characterStore.getDmgVal();
    this.setState({
      dmg,
      hitValue
    });
  }

  handleInventoryUpdate() {

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