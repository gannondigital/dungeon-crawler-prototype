
import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class CharacterStore extends Store {

  constructor() {
    super();
    this.data = {
      currLevel: 'one',
      currTileName: '1x1',
      currDirection: 'n'
    };

    //this.dispatchToken = dispatcher.register(this.handleDispatch.bind(this));
  }

  getDirection() {
    return this.data.currDirection;
  }

  getCurrTileName() {
    return this.data.currTileName;
  }

}

export const characterStore = new CharacterStore();

characterStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.TILE_SET:
      characterStore.data.currTileName = action.payload.tileName;
      characterStore.triggerChange();
      break;
    case constants.DIRECTION_SET:
      const newDir = action.payload.direction;
      if (!newDir || typeof newDir !== 'string') {
        throw new TypeError('Invalid direction received from DIRECTION_SET action');
      }

      const oldDirection = characterStore.data.currDirection;
      characterStore.data.currDirection = action.payload.direction;
      if (oldDirection !== characterStore.data.currDirection) {
        characterStore.triggerChange();
      }
      break;
    default:
      break;
  }
});
