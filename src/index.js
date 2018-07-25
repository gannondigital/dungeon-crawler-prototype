// bootstrapping application
import React from 'react';
import ReactDOM from 'react-dom';

import * as config from './js/config/config-default.json';
import { loadLevel } from './js/actions/actions-level';
import { tileActions } from './js/actions/actions-tile';
import { setDirection } from './js/actions/actions-character';
import { levelStore } from './js/stores/store-level';
import { tileStore } from './js/stores/store-tile';
import { directionStore } from './js/stores/store-direction';
import { GameRoot } from './js/components/game-root';

/** 
 * retrieve saved state if any
 * @todo
 */

const currDir = config.direction;
setDirection(currDir);

loadLevel(config.startLevel).then(() => {
  const currTileName = levelStore.getStartTilename();
  const currTile = levelStore.getTile(currTileName);
  // shouldn't the current tile be stored in the tileStore?
  
  ReactDOM.render( React.createElement(GameRoot, { 
    direction: currDir,
    initialTile: currTile,
    // tryin some dependency injection...
    tileFetcher: tileStore.getTile.bind(tileStore),
    directionFetcher: directionStore.getDirection.bind(directionStore)
  }), document.querySelector(config.rootSelector) );
}).catch((err) => {
  throw err;
});