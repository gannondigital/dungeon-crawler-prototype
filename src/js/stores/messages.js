import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { SHOW_GAME_MSG, REMOVE_GAME_MSG } from "../constants/actions";

class MessagesStore extends Store {
  constructor() {
    super();
    this.data = {
      msgs: [],
      showingMsg: false
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
  }

  handleAction = (action) => {
    const { type, payload } = action;

    switch (type) {
      // @todo validate
      case SHOW_GAME_MSG:
        const { msgText } = payload;
        this.data.msgs.push(msgText);
        this.data.showingMsg = true;
        this.triggerChange();
        break;
      case REMOVE_GAME_MSG:
        this.data = {
          msgs: [],
          showingMsg: false
        };
        this.triggerChange();
        break;
      default:
        break;
    }
  };

  getCurrMsgs() {
    return cloneDeep(this.data.msgs);
  }
}

const messagesStore = new MessagesStore();
export default messagesStore;
