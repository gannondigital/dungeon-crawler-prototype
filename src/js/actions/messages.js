import { dispatcher } from "../lib/game-dispatcher";
import {
  SHOW_GAME_MSG,
  REMOVE_GAME_MSG
} from "../constants/actions";
import { MSG_SPEED_MED } from "../constants/";

export const showGameMsg = (msgText) => {
  dispatcher.dispatch({
    type: SHOW_GAME_MSG,
    payload: {
      msgText
    }
  });
  setTimeout(removeGameMsg, MSG_SPEED_MED);
};

export const removeGameMsg = () => {
  dispatcher.dispatch({
    type: REMOVE_GAME_MSG
  });
};
