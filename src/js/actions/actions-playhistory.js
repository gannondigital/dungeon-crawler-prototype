import { dispatcher } from '../lib/game-dispatcher';
import * as constants from '../config/constants-actions.json';


export const addToPlayHistory = ({
  eventName,
  tileName
}) => {
  dispatcher.dispatch({
    type: constants.ADD_TO_HISTORY,
    payload: {
      eventName,
      tileName
    }
  });
}
