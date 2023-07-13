import React, { useCallback, useEffect } from "react";

import { startGame } from "../actions/game-status";

import "../../css/components/title-screen.scss";

const TITLE_SCREEN = ({}) => {
  const handleClick = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    window.addEventListener("keydown", startGame);
    return () => {
      window.removeEventListener("keydown", startGame);
    };
  }, []);

  return (
    <div className="title_screen">
      <button onClick={handleClick} className="title_screen--start_btn">
        Start
      </button>
    </div>
  );
};
export default TITLE_SCREEN;
