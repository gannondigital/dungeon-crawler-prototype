import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";

import config from "./js/config/default.json";

import { loadLevel } from "./js/actions/level";
import { loadMonsters } from "./js/actions/monsters";
import { loadItems } from "./js/actions/items";

// these all use a module-as-singleton pattern. Booting
// them up here because they need to start listening for
// actions. This is simple/crude but all I need for now
import characterStore from "./js/stores/character";
import playHistoryStore from "./js/stores/play-history";
import itemsStore from "./js/stores/items";
import combatStore from "./js/stores/combat";
import inventoryStore from "./js/stores/inventory";
import levelStore from "./js/stores/level";
import messagesStore from "./js/stores/messages";
import monstersStore from "./js/stores/monsters";

// same for combatRunner as it listens for actions
// https://frinkiac.com/caption/S11E09/251560
import combatRunner from "./js/lib/combat-runner";

import { UIRouter } from "./js/components/ui-router";
import "./css/lib/base.scss";

const { rootSelector, startingLevel } = config;

// @todo can these be done in 'parallel' or is there really a
// sequential dependency
async function bootstrapLevel(startingLevel) {
  try {
    await loadLevel(startingLevel);
    await loadMonsters(startingLevel);
    return loadItems(startingLevel);
  } catch (err) {
    err.message = `Error bootstrapping level: ${err.message}`;
    throw err;
  }
}

// @todo begin game with start screen, etc, initialize stuff
// to manage the gameplay status & view changing
// @todo don't load assets until we need them
await bootstrapLevel(startingLevel);
ReactDOM.render(
  React.createElement(UIRouter),
  document.querySelector(rootSelector)
);
