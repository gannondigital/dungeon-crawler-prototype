import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import * as constants from "../config/constants-actions";

class MessageStore extends Store {
  constructor() {
    super();
    this.data = {
      msgs: [],
      showingMsg: false
    };
  }

  getCurrMsgs() {
    return cloneDeep(this.data.msgs);
  }
}

export const msgStore = new MessageStore();

msgStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case constants.SHOW_GAME_MSG:
      const { msgText } = action.payload;
      const currMsgs = msgStore.data.msgs;
      currMsgs.push(msgText);
      msgStore.data.showingMsg = true;
      msgStore.triggerChange();
      break;
    case constants.REMOVE_GAME_MSG:
      msgStore.data = {
        msgs: [],
        showingMsg: false
      };
      msgStore.triggerChange();
      break;
    default:
      break;
  }
});
