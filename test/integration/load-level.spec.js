const tape = require("tape");

// under test
import { loadLevel } from "../../src/js/actions/level.js";
import levelStore from "../../src/js/stores/level.js";
import { TileFactory } from "../../src/js/factories/tile-factory.js";
import levelOne from "../../src/js/game-data/level-one";

tape("level can be loaded by calling an action creator", (t) => {
  t.plan(1);

  loadLevel("one")
    .then(() => {
      const tile = levelStore.getTile("1x2");
      t.deepEqual(
        tile,
        TileFactory(levelOne.tiles["1x2"]),
        "tile in store is identical to tile in raw level data"
      );
      t.end();
    })
    .catch((err) => {
      t.fail(err);
      t.end();
    });
});
