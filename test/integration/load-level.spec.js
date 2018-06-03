const tape = require('tape');

// under test
import { loadLevel } from '../../src/js/actions/actions-level.js';
import { levelStore } from '../../src/js/stores/store-level.js';
import { Tile } from '../../src/js/models/model-tile.js';
import * as levelOne from '../../src/js/data/level-one.json';

tape('level can be loaded by calling an action creator', (t) => {
  t.plan(1);

  loadLevel('one').then(() => {
    const tile = levelStore.getTile('1x2');
    t.deepEqual(tile, new Tile(levelOne.tiles['1x2']), 'tile in store is identical to tile in raw level data');
    t.end();
  }).catch((err) => {
    t.fail(err);
    t.end();
  });
});