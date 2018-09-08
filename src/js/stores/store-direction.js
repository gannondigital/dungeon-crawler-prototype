
import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class DirectionStore extends Store {

  constructor() {
    super();
    this.data = '';
  }

  getDirection() {
    return this.data;
  }

}

export const directionStore = new DirectionStore();
directionStore.dispatchToken = dispatcher.register((action) => {
	switch (action.type) {
		case constants.DIRECTION_SET:
			var newDir = action.payload.direction;
			if ( newDir !== directionStore.data ) {
				directionStore.data = newDir;
				directionStore.triggerChange();
			}
			break;
		default:
			break;
	}
});
