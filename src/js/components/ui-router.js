import React, { useCallback, useEffect, useState } from "react";

import Passage from "./Passage/passage";
import LevelMap from "./LevelMap/level-map";
import Inventory from "./Inventory/inventory";
import GameMsg from "./Passage/game-msg";
import GameHeader from "./GameHeader/game-header";
import TitleScreen from "./title-screen";
import { UI_INVENTORY, UI_MAP, UI_PASSAGE } from "../constants";
import { TITLE_SCREEN, GAMEPLAY } from "../constants/game-status";
import gameStatusStore from "../stores/game-status";
import { useStoreSubscription } from "../hooks";

// @todo review, where should this be imported
import "../../css/components/game-root.scss";

// @todo there should probably be clearer lines between in-game routing
// and out-of-game routing, but this works for now
export const UIRouter = () => {
  const [uiState, setUiState] = useState(null);

  const handleGameStatusChange = useCallback(() => {
    const currStatus = gameStatusStore.getGameStatus();
    switch (currStatus) {
      case TITLE_SCREEN:
        setUiState(TITLE_SCREEN);
        break;
      case GAMEPLAY:
        setUiState(UI_PASSAGE);
    }
  }, [gameStatusStore]);
  useEffect(handleGameStatusChange, []);
  useStoreSubscription([[gameStatusStore, handleGameStatusChange]]);

  const handleMapBtnClick = () => {
    setUiState(UI_MAP);
  };
  const handleBackBtnClick = () => {
    setUiState(UI_PASSAGE);
  };
  const handleInventoryBtnClick = () => {
    setUiState(UI_INVENTORY);
  };

  let currContent = null;
  // @todo make this all less cruddy
  switch (uiState) {
    case TITLE_SCREEN:
    default:
      currContent = <TitleScreen />;
      break;
    case UI_PASSAGE:
      currContent = <Passage />;
      break;
    case UI_MAP:
      currContent = <LevelMap />;
      break;
    case UI_INVENTORY:
      currContent = <Inventory />;
      break;
  }

  return (
    <div className="game-root">
      <GameMsg />
      <GameHeader
        handleBackBtnClick={handleBackBtnClick}
        handleMapBtnClick={handleMapBtnClick}
        handleInventoryBtnClick={handleInventoryBtnClick}
      />
      {currContent}
    </div>
  );
};
