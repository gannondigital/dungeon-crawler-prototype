import React, { useCallback } from "react";
import PropTypes from "prop-types";
import {
  UI_MAP,
  UI_PASSAGE,
  UI_INVENTORY,
  KEY_MAP,
  KEY_INVENTORY,
  KEY_BACK,
} from '../../constants';
import { TITLE_SCREEN } from "../../constants/game-status";
import { Compass } from "./compass";
import { useWindowKeydown } from '../../hooks';
import "../../../css/components/GameHeader/game-header.scss";

const BTN_INVENTORY = 'BTN_INVENTORY';
const BTN_MAP = 'BTN_MAP';
const BTN_BACK = 'BTN_BACK';

const SUPPORTED_BUTTONS = {
  [TITLE_SCREEN]: [],
  [UI_MAP]: [
    BTN_INVENTORY,
    BTN_BACK
  ],
  [UI_PASSAGE]: [
    BTN_INVENTORY,
    BTN_MAP
  ],
  [UI_INVENTORY]: [
    BTN_MAP,
    BTN_BACK
  ]
};

export const GameHeaderProvider = ({
  screenState,
  setScreenState,
}) => {
  const validBtns = SUPPORTED_BUTTONS[screenState];
  const handleMapBtnClick = useCallback(() => {
    setScreenState(UI_MAP);
  }, [setScreenState]);
  const handleBackBtnClick = useCallback(() => {
    setScreenState(UI_PASSAGE);
  }, [setScreenState]);
  const handleInventoryBtnClick = useCallback(() => {
    setScreenState(UI_INVENTORY);
  }, [setScreenState]);

  const handleWindowKeydown = useCallback((keyPressed) => {
    switch (keyPressed) {
      case KEY_MAP: 
        if (validBtns.includes(BTN_MAP)) handleMapBtnClick();
        break;
      case KEY_INVENTORY:
        if (validBtns.includes(BTN_INVENTORY)) handleInventoryBtnClick();
        break;
      case KEY_BACK:
        if (validBtns.includes(BTN_BACK)) handleBackBtnClick();
        break;
      default:
        break;
    }
  }, [validBtns]);
  useWindowKeydown(handleWindowKeydown);

  const gameHeaderProps = {
    handleBackBtnClick: validBtns.includes(BTN_BACK) ? handleBackBtnClick : null,
    handleInventoryBtnClick: validBtns.includes(BTN_INVENTORY) ? handleInventoryBtnClick: null,
    handleMapBtnClick: validBtns.includes(BTN_MAP) ? handleMapBtnClick : null,
  }

  return (
    <GameHeader {...gameHeaderProps} />
  );
}
export default GameHeaderProvider;

export const GameHeader = ({
  handleBackBtnClick,
  handleInventoryBtnClick,
  handleMapBtnClick,
}) => {
  if (
    !handleBackBtnClick &&
    !handleInventoryBtnClick &&
    !handleMapBtnClick
  ) {
    return null;
  }

  return (
    <header className="game_header">
      {handleBackBtnClick && (
        <button className="header-nav-button" onClick={handleBackBtnClick}>
          Back
        </button>
      )}
      {handleInventoryBtnClick && (
        <button className="header-nav-button" onClick={handleInventoryBtnClick}>
          Inventory
        </button>
      )}
      {handleMapBtnClick && (
        <button className="header-nav-button" onClick={handleMapBtnClick}>
          Map
        </button>
      )}
      <Compass />
    </header>
  );
};
GameHeader.propTypes = {
  handleBackBtnClick: PropTypes.oneOf([null, PropTypes.func]),
  handleInventoryBtnClick: PropTypes.oneOf([null, PropTypes.func]),
  handleMapBtnClick: PropTypes.oneOf([null, PropTypes.func]),
};

GameHeaderProvider.propTypes = {
  screenState: PropTypes.string,
  setScreenState: PropTypes.func,
};
