import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';
import * as gameConfig from '../config/config-default.json';

export const showGameMsg = (msgText) => {
  dispatcher.dispatch({
    type: constants.SHOW_GAME_MSG,
    payload: {
      msgText
    }
  });
  setTimeout(removeGameMsg, gameConfig.msgSpeed)
};

export const removeGameMsg = () => {
  dispatcher.dispatch({
    type: constants.REMOVE_GAME_MSG,
  });
};
