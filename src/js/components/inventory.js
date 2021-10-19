import React, { Component } from "react";
import PropTypes from "prop-types";

import inventoryStore from "../stores/inventory";
import Item from "../models/item";
import { ItemTile } from "./item-tile";

import "../../css/components/inventory.scss";
import ItemFactory from "../lib/item-factory";

// @todo if we have more item roles, abstract out the roles
// @todo more specific naming in line with roles that manage 
// views by game state, etc.
export class Inventory extends Component {
  constructor(props) {
    super(props);

    const activeWeapon = inventoryStore.getActiveWeapon();
    const activeArmor = inventoryStore.getActiveArmor();
    const itemsByType = inventoryStore.getFullInventory();

    this.state = {
      uiState: "equipped", // "armor" | "weapons" | "items"
      items: itemsByType,
      activeWeapon,
      activeArmor
    };
  }

  // @todo probably worth having a shared abstraction for
  // the boilerplate of connecting to the store
  handleInventoryUpdate() {
    const activeWeapon = inventoryStore.getActiveWeapon();
    const activeArmor = inventoryStore.getActiveArmor();
    const itemsByType = inventoryStore.getFullInventory();

    this.setState({
      items: itemsByType,
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
    
    // @todo better names here
    let itemsBeingShown;
    if (uiState === "equipped") {
      itemsBeingShown = [activeWeapon, activeArmor]
    } else {
      itemsBeingShown = items[uiState];
    }

    const itemTiles = itemsBeingShown.map(item =>  {
      return  (<ItemTile
        item={item}
        key={item.getName()}
      />);
    });

    // @todo this is pretty hardcode-y but it'll do for now
    // @todo use 'classnames' library
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
        <section className="inventory--content">{itemTiles}</section>
      </div>
    );
  }
}
