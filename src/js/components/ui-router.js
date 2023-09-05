import React, { useCallback, useEffect, useState } from "react";

import Passage from "./Passage/passage";
import LevelMap from "./LevelMap/level-map";
import Inventory from "./Inventory/inventory";
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
  const [screenState, setScreenState] = useState(TITLE_SCREEN);

  const handleGameStatusChange = useCallback(() => {
    const currStatus = gameStatusStore.getGameStatus();
    switch (currStatus) {
      case TITLE_SCREEN:
        setScreenState(TITLE_SCREEN);
        break;
      case GAMEPLAY:
        setScreenState(UI_PASSAGE);
    }
  }, [gameStatusStore]);
  useEffect(handleGameStatusChange, []);
  useStoreSubscription([[gameStatusStore, handleGameStatusChange]]);


  let currContent = null;
  switch (screenState) {
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
      <GameHeader screenState={screenState} setScreenState={setScreenState} />
      {currContent}
    </div>
  );
};
