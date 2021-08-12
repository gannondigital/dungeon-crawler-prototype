// bootstrapping application
import React from "react";
import ReactDOM from "react-dom";

import config from "./js/config/default";

import { loadLevel } from "./js/actions/actions-level";
import { loadMonsters } from "./js/actions/actions-monsters";
import { loadItems } from "./js/actions/actions-items";
import {
  setActiveWeapon,
  setActiveArmor,
  addToInventory
} from "./js/actions/actions-inventory";

import characterStore from "./js/stores/character";
import playHistoryStore from "./js/stores/play-history";
import itemsStore from "./js/stores/items";

import { GameRoot } from "./js/components/game-root";

// @todo more mature version of this that loads saved state 
// and falls back to defaults
function bootstrapCharacter() {
  const initialWeapon = itemsStore.getItems(["staff"])[0];
  const initialArmor = itemsStore.getItems(["clothes"])[0];

  setActiveWeapon(initialWeapon);
  setActiveArmor(initialArmor);

  // @todo this shouldn't be an add, we should just bootstrap
  // the inventory with saved data or a default starting item set
  addToInventory([initialWeapon, initialArmor]);
}

// @todo support non-gameplay states like start screen, don't
// load assets until we need them
loadLevel(config.startingLevel)
  .then(() => {
    return loadMonsters(config.startingLevel);
  })
  .then(() => {
    return loadItems(config.startingLevel);
  })
  .then(() => {
    // @todo load character
    bootstrapCharacter();

    ReactDOM.render(
      React.createElement(GameRoot),
      document.querySelector(config.rootSelector)
    );
  })
  .catch(err => {
    throw err;
  });
