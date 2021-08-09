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

import { characterStore } from "./js/stores/store-character";
import { playHistoryStore } from "./js/stores/store-play-history";
import { itemsStore } from "./js/stores/store-items";

import { GameRoot } from "./js/components/game-root";

/**
 * retrieve saved state if any
 * @todo
 */

// @todo more mature version of this
function bootstrapCharacter() {
  const initialWeapon = itemsStore.getItems(["staff"])[0];
  const initialArmor = itemsStore.getItems(["clothes"])[0];

  setActiveWeapon(initialWeapon);
  setActiveArmor(initialArmor);

  addToInventory([initialWeapon, initialArmor]);
}

// @todo support non-gameplay states like start screen, don't
// load assets until we need them
loadLevel(config.startLevel)
  .then(() => {
    return loadMonsters(config.startLevel);
  })
  .then(() => {
    return loadItems(config.startLevel);
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
