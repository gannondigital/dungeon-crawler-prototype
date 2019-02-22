import React, { Component } from 'react';

//import { attack } from '../actions/actions-combat';
import { attach } from '../lib/combat';
import { characterStore } from '../stores/store-character';
//import { inventoryStore } from '../stores/store-inventory';
import { combatStore } from '../stores/store-combat';
import { Damage } from '../models/model-damage';

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
    this.handleCharacterUpdate()
    characterStore.listen(this.handleCharacterUpdate);
    //inventoryStore.listen(this.handleInventoryUpdate);
  }

  componentWillUnmount() {
    characterStore.stopListening(this.handleCharacterUpdate);
    //inventoryStore.stopListening(this.handleInventoryUpdate);
  }

  handleAttackClick() {
    const { dmg, hitValue } = this.state;
    attack({ dmg, hitValue });
  }

  handleCharacterUpdate() {
    const hitValue = characterStore.getHitVal();
    // @todo account for dmg type in addition to amount
    const dmgPoints = characterStore.getDmgVal();
    const dmg = new Damage({
      dmgPoints,
      type: 'normal'
    })
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