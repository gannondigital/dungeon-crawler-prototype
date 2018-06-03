
import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class CharacterStore extends Store {

  constructor() {
    super();
    this.data = {
      currLevel: 'one',
      currTile: 'Ax1',
      currDirection: 'n'
    };

    this.dispatchToken = dispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch (action.type) {
      case constants.DIRECTION_SET:
        const newDir = action.payload.direction;
        if (!newDir || typeof newDir !== 'string') {
          throw new TypeError('Invalid direction received from DIRECTION_SET action');
        }

        const oldDirection = this.data.currDirection;
        this.data.currDirection = action.payload.direction;
        if (oldDirection !== this.data.currDirection) {
          this.triggerChange();
        }
      default:
        break;
    }
  }

  getDirection() {
    return this.data.currDirection;
  }

}

export const characterStore = new CharacterStore();

