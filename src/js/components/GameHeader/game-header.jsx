import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import {
  UI_MAP,
  UI_PASSAGE,
  UI_INVENTORY,
  KEY_MAP,
  KEY_INVENTORY,
  KEY_BACK,
} from "../../constants";
import { TITLE_SCREEN } from "../../constants/game-status";
import { Compass } from "./compass";
import { useWindowKeydown } from "../../hooks";
import "../../../css/components/GameHeader/game-header.scss";
import { uiDelayedUpdate } from "../../lib/util";

const BTN_INVENTORY = "BTN_INVENTORY";
const BTN_MAP = "BTN_MAP";
const BTN_BACK = "BTN_BACK";

const SUPPORTED_BUTTONS = {
  [TITLE_SCREEN]: [],
  [UI_MAP]: [BTN_INVENTORY, BTN_BACK],
  [UI_PASSAGE]: [BTN_INVENTORY, BTN_MAP],
  [UI_INVENTORY]: [BTN_MAP, BTN_BACK],
};

export const GameHeaderProvider = ({ screenState, setScreenState }) => {
  const validBtns = SUPPORTED_BUTTONS[screenState];
  const [activeButton, setActiveButton] = useState(null);
  const handleBackBtnClick = useCallback(() => {
    setScreenState(UI_PASSAGE);
  }, [setScreenState]);
  const handleInventoryBtnClick = useCallback(() => {
    setScreenState(UI_INVENTORY);
  }, [setScreenState]);
  const handleMapBtnClick = useCallback(() => {
    setScreenState(UI_MAP);
  }, [setScreenState]);

  const handleWindowKeydown = useCallback(
    async (keyPressed) => {
      switch (keyPressed) {
        case KEY_BACK:
          if (validBtns.includes(BTN_BACK)) {
            setActiveButton("back");
            await uiDelayedUpdate(() => {
              setActiveButton(null);
            });
            handleBackBtnClick();
          }
          break;
        case KEY_INVENTORY:
          if (validBtns.includes(BTN_INVENTORY)) {
            setActiveButton("inventory");
            await uiDelayedUpdate(() => {
              setActiveButton(null);
            });
            handleInventoryBtnClick();
          }
          break;
        case KEY_MAP:
          if (validBtns.includes(BTN_MAP)) {
            setActiveButton("map");
            await uiDelayedUpdate(() => {
              setActiveButton(null);
            });
            handleMapBtnClick();
          }
          break;
        default:
          break;
      }
    },
    [validBtns]
  );
  useWindowKeydown(handleWindowKeydown);

  const gameHeaderProps = {
    activeButton,
    handleBackBtnClick: validBtns.includes(BTN_BACK)
      ? handleBackBtnClick
      : null,
    handleInventoryBtnClick: validBtns.includes(BTN_INVENTORY)
      ? handleInventoryBtnClick
      : null,
    handleMapBtnClick: validBtns.includes(BTN_MAP) ? handleMapBtnClick : null,
  };

  return <GameHeader {...gameHeaderProps} />;
};
export default GameHeaderProvider;

/**
 * Displays header buttons when there is a callback passed for that
 */
export const GameHeader = ({
  activeButton,
  handleBackBtnClick,
  handleInventoryBtnClick,
  handleMapBtnClick,
}) => {
  if (!handleBackBtnClick && !handleInventoryBtnClick && !handleMapBtnClick) {
    return null;
  }
  const backClassnames = classnames({
    "header-nav-button": true,
    active: activeButton === "back",
  });
  const inventoryClassnames = classnames({
    "header-nav-button": true,
    active: activeButton === "inventory",
  });
  const mapClassnames = classnames({
    "header-nav-button": true,
    active: activeButton === "map",
  });
  return (
    <header className="game_header">
      {handleBackBtnClick && (
        <button className={backClassnames} onClick={handleBackBtnClick}>
          Back
        </button>
      )}
      {handleInventoryBtnClick && (
        <button
          className={inventoryClassnames}
          onClick={handleInventoryBtnClick}
        >
          Inventory
        </button>
      )}
      {handleMapBtnClick && (
        <button className={mapClassnames} onClick={handleMapBtnClick}>
          Map
        </button>
      )}
      <Compass />
    </header>
  );
};
GameHeader.propTypes = {
  handleBackBtnClick: PropTypes.func,
  handleInventoryBtnClick: PropTypes.func,
  handleMapBtnClick: PropTypes.func,
};

GameHeaderProvider.propTypes = {
  screenState: PropTypes.string.isRequired,
  setScreenState: PropTypes.func.isRequired,
};
