import { dispatcher } from "../lib/game-dispatcher";
import actionConstants from "../config/constants-actions.json";
import generalConstants from "../config/constants-general.json";
import * as gameConfig from "../config/config-default.json";

export const showGameMsg = (msgText) => {
  dispatcher.dispatch({
    type: actionConstants.SHOW_GAME_MSG,
    payload: {
      msgText
    }
  });
  setTimeout(removeGameMsg, generalConstants.MSG_SPEED_MED);
};

export const removeGameMsg = () => {
  dispatcher.dispatch({
    type: actionConstants.REMOVE_GAME_MSG
  });
};
