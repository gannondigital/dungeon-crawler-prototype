
import { Store } from '../lib/store';
import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions';

class MessageStore extends Store {

  constructor() {
    super();
    this.data = {
      msgText: '',
      showingMsg: false
    };
  }

  getCurrMsgText() {
    return this.data.msgText;
  }

}

export const msgStore = new MessageStore();

msgStore.dispatchToken = dispatcher.register((action) => {
  switch (action.type) {
    case constants.SHOW_GAME_MSG:
      const { msgText } = action.payload;
      msgStore.data = Object.assign(msgStore.data, {
        msgText,
        showingMsg: true
      });
      msgStore.triggerChange();
      break;
    case constants.REMOVE_GAME_MSG:
      msgStore.data = {
        msgText: '',
        showingMsg: false
      };
      msgStore.triggerChange();
      break;
    default:
      break;
  }
});
