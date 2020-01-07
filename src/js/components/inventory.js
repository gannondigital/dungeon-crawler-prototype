import React, { Component } from "react";
import PropTypes from "prop-types";

import { inventoryStore } from "../stores/store-inventory";
import Item from "../models/model-item";
import { ItemTile } from "./item-tile";

// @todo if we have more item roles, abstract out the roles
export class Inventory extends Component {
  constructor(props) {
    super(props);

    const allItems = inventoryStore.getAllItems();
    const activeWeapon = inventoryStore.getActiveWeapon();

    this.state = {
      uiState: "items", // 'armor' || 'weapons'
      items: allItems,
      activeWeapon
    };
  }

  switchToArmsArmor = () => {
    this.setState({ uiState: "armor" });
  };

  switchToWeapons = () => {
    this.setState({ uiState: "weapons" });
  };

  switchToItems = () => {
    this.setState({ uiState: "items" });
  };

  handleInventoryUpdate() {
    const allItems = inventoryStore.getAllItems();
    const activeWeapon = inventoryStore.getActiveWeapon();
    this.setState({
      items: allItems,
      activeWeapon
    });
  }

  componentDidMount() {
    inventoryStore.listen(this.handleInventoryUpdate);
  }

  componentWillUnmount() {
    inventoryStore.stopListening(this.handleInventoryUpdate);
  }

  render() {
    const { uiState, items, activeWeapon } = this.state;
    const itemsToRender = items[uiState];

    const itemComponents = itemsToRender.map(item => {
      return <ItemTile item={item} />;
    });

    return (
      <div className="inventory">
        <button onClick={this.props.closeClickHandler}>Back</button>
        <div className="inventory--tabs">
          <button>Arms & Armor</button>
          <button>Items</button>
        </div>
        <div className="inventory--active_weapon">
          <span>Active Weapon:</span>
          <ItemTile item={activeWeapon} />
        </div>
        <div className="inventory--itemlist">{itemComponents}</div>
      </div>
    );
  }
}

Inventory.propTypes = {
  items: PropTypes.arrayOf(Item)
};

Inventory.defaultProps = {
  items: []
};

const sortItems = items => {
  const sorted = {
    armsAndArmor: [],
    items: []
  };

  items.forEach(item => {
    if (item.hasRole(["weapon", "armor"])) {
      sorted.armsAndArmor.push(item);
    } else {
      sorted.items.push(item);
    }
  });

  return sorted;
};
