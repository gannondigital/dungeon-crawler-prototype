import "core-js/stable";
import "regenerator-runtime/runtime";
// ^ those are for babel
import React from "react";
import ReactDOM from "react-dom";

import config from "./js/config/default";

import { loadLevel } from "./js/actions/level";
import { loadMonsters } from "./js/actions/monsters";
import { loadItems } from "./js/actions/items";
import {
  setActiveWeapon,
  setActiveArmor,
  addToInventory
} from "./js/actions/inventory";

// these all use a module-as-singleton pattern. Booting
// them up here because they need to start listening for
// actions. This is simple/crude but all I need for now
import characterStore from "./js/stores/character";
import playHistoryStore from "./js/stores/play-history";
import itemsStore from "./js/stores/items";
import combatStore  from "./js/stores/combat";
import inventoryStore from "./js/stores/inventory";
import levelStore from "./js/stores/level";
import messagesStore from "./js/stores/messages";
import monstersStore from "./js/stores/monsters";

import { GameRoot } from "./js/components/game-root";

const { 
  rootSelector,
  startingLevel,
  startingWeapon,
  startingArmor
} = config;

// @todo more mature version of this that loads saved state 
// and falls back to defaults
function bootstrapCharacter() {
  const initialWeapon = itemsStore.getItem(startingWeapon);
  const initialArmor = itemsStore.getItem(startingArmor);

  setActiveWeapon(initialWeapon);
  setActiveArmor(initialArmor);

  // @todo this shouldn't be an add, we should just bootstrap
  // the inventory store with saved data or a default starting item set
  addToInventory([initialWeapon, initialArmor]);
}

// @todo what's the support for top-level await
// @todo can these be done in 'parallel' or is there really a 
// sequential dependency
async function bootstrapLevel(startingLevel) {
  await loadLevel(startingLevel);
  await loadMonsters(startingLevel);
  return loadItems(startingLevel);
}

// @todo begin game with start screen, etc, initialize stuff
// to manage the gameplay status & view changing
// @todo don't load assets until we need them
bootstrapLevel(startingLevel)
  .then(() => {
    // @todo load saved character
    bootstrapCharacter();

    ReactDOM.render(
      React.createElement(GameRoot),
      document.querySelector(rootSelector)
    );
  })
  .catch(err => {
    throw err;
  });
