
import { Store } from '../lib/store';
import cloneDeep from 'lodash.cloneDeep';

import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class TileStore extends Store {

  constructor() {
    super();
    this.data = {
      tile: null
    };
  }

  getTile() {
    return cloneDeep(this.data.tile);
  }

}


export const tileStore = new TileStore();
tileStore.dispatchToken = dispatcher.register((action) => {
	switch (action.type) {
		case constants.TILE_SET:
			  tileStore.data.tile = cloneDeep(action.payload.tile);
        // @todo : only trigger on change
			 	tileStore.triggerChange();
			break;
		default:
			break;
	}
});
