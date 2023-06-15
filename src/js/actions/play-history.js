import { dispatcher } from "../lib/game-dispatcher";
import { ADD_TO_HISTORY } from "../constants/actions";

export const addToPlayHistory = ({ eventName, tileName }) => {
  dispatcher.dispatch({
    type: ADD_TO_HISTORY,
    payload: {
      eventName,
      tileName,
    },
  });
};
