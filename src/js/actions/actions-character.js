import { dispatcher } from "../lib/game-dispatcher";
import * as constants from "../constants/constants-actions";
import { levelStore } from "../stores/store-level";
import { startCombat as startCombatAction } from "../actions/actions-combat";
import { startCombat } from "../lib/combat";
import { tileHasUndefeatedOpponents } from "../lib/combat";
import { CHARACTER } from "../constants/constants-general";

export const setDirection = dir => {
  if (!dir || typeof dir !== "string") {
    console.log("invalid direction passed to setDirection");
    return;
  }
  dispatcher.dispatch({
    type: constants.DIRECTION_SET,
    payload: {
      direction: dir
    }
  });
};

export const setTile = tileName => {
  const tile = levelStore.getTile(tileName);

  dispatcher.dispatch({
    type: constants.TILE_SET,
    payload: { tileName }
  });

  // @todo this is a weird place to do this, also
  // weird that there's an action and a fn for starting combat
  // maybe move all this to lib/combat?
  if (tileHasUndefeatedOpponents(tile)) {
    const monsters = tile.getMonsters();
    startCombatAction({ opponents: monsters });
    startCombat({ whoHasAdvantage: CHARACTER });
  }
};
