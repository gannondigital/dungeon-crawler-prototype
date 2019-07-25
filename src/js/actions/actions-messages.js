import { dispatcher } from '../lib/game-dispatcher';
import actionConstants from '../config/constants-actions.json';
import generalConstants from '../config/constants-general.json';
import * as gameConfig from '../config/config-default.json';

export const showGameMsg = (msgText, msgSpeed) => {
  const speed = (msgSpeed === generalConstants.MSG_SPEED_MED) ? gameConfig.msgSpeedMed : gameConfig.msgSpeedFast
  dispatcher.dispatch({
    type: actionConstants.SHOW_GAME_MSG,
    payload: {
      msgText
    }
  });
  setTimeout(removeGameMsg, speed)
};

export const removeGameMsg = () => {
  dispatcher.dispatch({
    type: actionConstants.REMOVE_GAME_MSG,
  });
};
