import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

class MessagesStore extends Store {
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

const messagesStore = new MessagesStore();
messagesStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case constants.SHOW_GAME_MSG:
      const { msgText } = action.payload;
      const currMsgs = messagesStore.data.msgs;
      currMsgs.push(msgText);
      messagesStore.data.showingMsg = true;
      messagesStore.triggerChange();
      break;
    case constants.REMOVE_GAME_MSG:
      messagesStore.data = {
        msgs: [],
        showingMsg: false
      };
      messagesStore.triggerChange();
      break;
    default:
      break;
  }
});

export default messagesStore;
