import React, { useState } from "react";

import Passage from "./passage";
import LevelMap from "./level-map";
import Inventory from "./inventory";
import GameMsg from "./game-msg";
import GameHeader from "./GameHeader/game-header";
import { UI_INVENTORY, UI_MAP, UI_PASSAGE } from "../constants";

// @todo review
import "../../css/components/game-root.scss";

export const UIRouter = () => {
  const [uiState, setUiState] = useState(UI_PASSAGE);

  const handleMapBtnClick = () => {
    setUiState(UI_MAP);
  };
  const handleBackBtnClick = () => {
    setUiState(UI_PASSAGE);
  };

  const handleInventoryBtnClick = () => {
    setUiState(UI_INVENTORY);
  };

  let gameContent = null;
  // @todo make this all less cruddy
  switch (uiState) {
    case UI_PASSAGE:
      gameContent = <Passage />;
      break;
    case UI_MAP:
      gameContent = <LevelMap rows={10} columns={20} />;
      break;
    case UI_INVENTORY:
      gameContent = <Inventory />;
      break;
    default:
      throw new TypeError("Invalid UI state in GameRoot");
  }

  return (
    <div className="game-root">
      <GameMsg />
      <GameHeader
        handleBackBtnClick={handleBackBtnClick}
        handleMapBtnClick={handleMapBtnClick}
        handleInventoryBtnClick={handleInventoryBtnClick}
      />
      {gameContent}
    </div>
  );
};
