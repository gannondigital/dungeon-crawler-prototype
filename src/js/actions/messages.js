import { dispatcher } from "../lib/game-dispatcher";
import actionConstants from "../constants/actions";
import generalConstants from "../constants/";
import gameConfig from "../config/default";

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
