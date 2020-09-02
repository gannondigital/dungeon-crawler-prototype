import React, { Component } from "react";
import PropTypes from "prop-types";

import { inventoryStore } from "../stores/store-inventory";
import Item from "../models/model-item";
import { ItemTile } from "./item-tile";

import "../../css/components/inventory.scss";

// @todo if we have more item roles, abstract out the roles
export class Inventory extends Component {
  constructor(props) {
    super(props);

    const activeWeapon = inventoryStore.getActiveWeapon();
    const activeArmor = inventoryStore.getActiveArmor();
    const sortedItems = inventoryStore.getAllItems();

    this.state = {
      uiState: "equipped", // "armor" | "weapons" | "items"
      items: sortedItems,
      activeWeapon,
      activeArmor
    };
  }

  handleInventoryUpdate() {
    const activeWeapon = inventoryStore.getActiveWeapon();
    const activeArmor = inventoryStore.getActiveArmor();
    const sortedItems = inventoryStore.getAllItems();

    this.setState({
      items: sortedItems,
      activeWeapon,
      activeArmor
    });
  }

  componentDidMount() {
    inventoryStore.listen(this.handleInventoryUpdate);
  }

  componentWillUnmount() {
    inventoryStore.stopListening(this.handleInventoryUpdate);
  }

  render() {
    const { uiState, items, activeWeapon, activeArmor } = this.state;

    // @todo are these going to stay similar enough that we can consolidate this?
    let panelContents;
    switch (uiState) {
      case "armor":
        panelContents = items.armor.map(item => (
          <ItemTile item={item} key={item.name} />
        ));
        break;
      case "weapons":
        panelContents = items.weapons.map(item => (
          <ItemTile item={item} key={item.name} />
        ));
        break;
      case "items":
        panelContents = items.items.map(item => (
          <ItemTile item={item} key={item.name} />
        ));
        break;
      // @todo labels etc, nicer ui
      case "equipped":
        panelContents = [activeWeapon, activeArmor].map(item => (
          <ItemTile item={item} key={item.name} />
        ));
        break;
    }

    // @todo this is pretty hardcode-y but it'll do for now
    const tabs = ["equipped", "armor", "weapons", "items"].map(tabname => {
      return (
        <button
          key={tabname}
          onClick={() => this.setState({ uiState: tabname })}
          className={uiState === tabname ? "inventory_tab--selected" : ""}
        >
          {tabname.toUpperCase()}
        </button>
      );
    });

    return (
      <div className="inventory">
        <nav className="inventory--tabs">{tabs}</nav>
        <section className="inventory--content">{panelContents}</section>
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
