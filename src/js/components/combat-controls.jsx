import React, { Component } from 'react';

//import { attack } from '../actions/actions-combat';
import { attack } from '../lib/combat';
import { characterStore } from '../stores/store-character';
//import { inventoryStore } from '../stores/store-inventory';
import { combatStore } from '../stores/store-combat';
import { Damage } from '../models/model-damage';

export class CombatControls extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dmg: 0,
      accuracy: 0
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
    const { dmg, accuracy } = this.state;
    attack({ dmg, accuracy });
  }

  handleCharacterUpdate() {
    const accuracy = characterStore.getAccuracy();
    // @todo account for dmg type in addition to amount
    const str = characterStore.getStr();
    const dmg = new Damage({
      dmgPoints: str,
      types: ['normal']
    })
    this.setState({
      dmg,
      accuracy
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