import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { START_GAME } from "../constants/actions";
import { TITLE_SCREEN, GAMEPLAY } from "../constants/game-status";

class GameStatusStore extends Store {
  constructor() {
    super();
    this.data = {
      status: TITLE_SCREEN,
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  getGameStatus() {
    return this.data.status;
  }

  handleAction = (action) => {
    const { type } = action;

    switch (type) {
      case START_GAME:
        if (this.data.status !== GAMEPLAY) {
          this.data.status = GAMEPLAY;
          this.triggerChange();
        }
        break;
      default:
        break;
    }
  };
}

const gameStatusStore = new GameStatusStore();
export default gameStatusStore;
