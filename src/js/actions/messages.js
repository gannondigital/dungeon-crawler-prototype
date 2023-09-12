import { dispatcher } from "../lib/game-dispatcher";
import { gameplayWait } from "../lib/util";
import { SHOW_GAME_MSG, REMOVE_GAME_MSG } from "../constants/actions";
import config from "../config/default";
const { msgSpeed } = config;

// @todo the model for messages might be less flux-y because we
// often want to do it while we are responding to a dispatch
// that's why we cheat with the first requestAnimationFrame
export const showGameMsg = async (msgText) => {
  window.requestAnimationFrame(() => {
    dispatcher.dispatch({
      type: SHOW_GAME_MSG,
      payload: {
        msgText,
      },
    });
  });

  // @todo move pause to msg component, increase with message count
  await gameplayWait(msgSpeed);
  removeGameMsg();
};

export const removeGameMsg = () => {
  dispatcher.dispatch({
    type: REMOVE_GAME_MSG,
    payload: {},
  });
};
