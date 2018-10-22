// bootstrapping application
import React from 'react';
import ReactDOM from 'react-dom';

import * as config from './js/config/config-default.json';
import { loadLevel } from './js/actions/actions-level';
import { loadMonsters } from './js/actions/actions-monsters';
import { setDirection } from './js/actions/actions-character';
import { levelStore } from './js/stores/store-level';       
import { characterStore } from './js/stores/store-character';
import { GameRoot } from './js/components/game-root';

/** 
 * retrieve saved state if any
 * @todo
 */

loadLevel(config.startLevel).then(() => {
  return loadMonsters(config.startLevel);
}).then(() => {
  ReactDOM.render( React.createElement(GameRoot, {
    // tryin some dependency injection...
    tileFetcher: levelStore.getTile.bind(levelStore),
    directionFetcher: characterStore.getDirection.bind(characterStore)
  }), document.querySelector(config.rootSelector) );
}).catch((err) => {
  throw err;
});