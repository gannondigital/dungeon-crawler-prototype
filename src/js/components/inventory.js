import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Item } from '../models/item';
import { ItemTile } from './item-tile';

// @todo if we have more item roles, abstract out the roles
export class Inventory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uiState: 'armsAndArmor' // or 'items'
    };
  }

  switchToArmsArmor = () => {
    this.setState({ uiState: 'armsAndArmor' });
  };

  switchToItems = () => {
    this.setState({ uiState: 'items' });
  };

  render() {
    const { armsAndArmor, items } = sortItems(this.props.items);
    const itemsToRender = (this.state.uiState === 'armsAndArmor') ? armsAndArmor : items;
    const itemComponents = itemsToRender.map((item) => {
      return (<ItemTile item={item} />);
    });

    return (
      <div class="inventory">
        <div class="inventory--tabs">
          <button>Arms & Armor</button>
          <button>Items</button>
        </div>
        <div class="inventory--itemlist">
          { itemComponents }
        </div>
      </div>
    );
  }

}

Inventory.propTypes = {
  items: PropTypes.arrayOf(Item),
};

const sortItems = (items) => {
  const sorted = {
    armsAndArmor: [],
    items: []
  };

  items.forEach((item) => {
    if (item.hasRole(['weapon', 'armor'])) {
      sorted.armsAndArmor.push(item);
    } else {
      sorted.items.push(item);
    }
  });

  return sorted;
};