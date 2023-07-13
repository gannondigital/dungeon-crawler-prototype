import { dispatcher } from "../lib/game-dispatcher";
import { START_GAME } from "../constants/actions";

export const startGame = () => {
  dispatcher.dispatch({
    type: START_GAME,
    payload: {},
  });
};
