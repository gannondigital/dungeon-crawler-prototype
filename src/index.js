// bootstrapping application
import React from "react";
import ReactDOM from "react-dom";

import * as config from "./js/config/config-default.json";

import { loadLevel } from "./js/actions/actions-level";
import { loadMonsters } from "./js/actions/actions-monsters";
import { loadItems } from "./js/actions/actions-items";
import {
  setActiveWeapon,
  setActiveArmor
} from "./js/actions/actions-inventory";

import { levelStore } from "./js/stores/store-level";
import { characterStore } from "./js/stores/store-character";
import { playHistoryStore } from "./js/stores/store-play-history";
import { itemsStore } from "./js/stores/store-items";

import { GameRoot } from "./js/components/game-root";

/**
 * retrieve saved state if any
 * @todo
 */

loadLevel(config.startLevel)
  .then(() => {
    return loadMonsters(config.startLevel);
  })
  .then(() => {
    return loadItems(config.startLevel);
  })
  .then(() => {
    bootstrapCharacter();
    ReactDOM.render(
      React.createElement(GameRoot, {
        // tryin some dependency injection...
        tileFetcher: levelStore.getTile.bind(levelStore),
        directionFetcher: characterStore.getDirection.bind(characterStore)
      }),
      document.querySelector(config.rootSelector)
    );
  })
  .catch(err => {
    throw err;
  });

// @todo more mature version of this
function bootstrapCharacter() {
  const initialWeapon = itemsStore.getItems(["staff"])[0];
  setActiveWeapon(initialWeapon);

  const initialArmor = itemsStore.getItems(["clothes"])[0];
  setActiveArmor(initialArmor);
}
