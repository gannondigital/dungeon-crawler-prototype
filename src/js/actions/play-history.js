import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

export const addToPlayHistory = ({ eventName, tileName }) => {
  dispatcher.dispatch({
    type: constants.ADD_TO_HISTORY,
    payload: {
      eventName,
      tileName
    }
  });
};
