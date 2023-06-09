import React, { useCallback, useEffect, useState } from "react";

import inventoryStore from "../stores/inventory";
import { ItemTile } from "./item-tile";
import { useStoreSubscription } from "../hooks";

import "../../css/components/inventory.scss";

// @todo if we have more item roles, abstract out the roles
// @todo more specific naming in line with roles that manage
// views by game state, etc.
export const Inventory = ({}) => {
  const [uiState, setUiState] = useState("equipped");
  const [items, setItems] = useState({});
  const [activeWeapon, setActiveWeapon] = useState(null);
  const [activeArmor, setActiveArmor] = useState(null);

  const pullLatestFromStore = useCallback(() => {
    setActiveWeapon(inventoryStore.getActiveWeapon());
    setActiveArmor(inventoryStore.getActiveArmor());
    setItems(inventoryStore.getItemsByType());
  }, [setActiveWeapon, setActiveArmor, setItems, inventoryStore]);

  useEffect(pullLatestFromStore, []);

  useStoreSubscription([[inventoryStore, pullLatestFromStore]]);

  let itemsBeingShown = [];
  if (Object.keys(items).length) {
    if (uiState === "equipped" && activeWeapon && activeArmor) {
      itemsBeingShown = [activeWeapon, activeArmor];
    } else {
      itemsBeingShown = items[uiState];
    }
  }

  // assumes each item is unique (for key purposes)
  const itemTiles = itemsBeingShown.map((item) => {
    return <ItemTile item={item} key={item.getName()} />;
  });

  // @todo this is pretty hardcode-y but it'll do for now
  const tabs = ["equipped", "armor", "weapons", "items"].map((tabname) => {
    return (
      <button
        key={tabname}
        onClick={() => setUiState(tabname)}
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
};
export default Inventory;
