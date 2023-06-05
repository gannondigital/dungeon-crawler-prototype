import React from "react";
import PropTypes from "prop-types";

import { Compass } from "./compass";
import { DIRECTIONS, UI_INVENTORY, UI_MAP, UI_PASSAGE } from "../constants";

import "../../css/components/game-header.scss";
import "../../css/components/header-nav-button";

export const GameHeader = ({
  handleBackBtnClick,
  handleInventoryBtnClick,
  handleMapBtnClick,
}) => {
  // @todo highlight active tab
  return (
    <header className="game_header">
      <button className="header-nav-button" onClick={handleBackBtnClick}>
        Back
      </button>
      <button className="header-nav-button" onClick={handleInventoryBtnClick}>
        Inventory
      </button>
      <button className="header-nav-button" onClick={handleMapBtnClick}>
        Map
      </button>
      <Compass />
    </header>
  );
};
export default GameHeader;

GameHeader.propTypes = {
  handleBackBtnClick: PropTypes.func,
  handleInventoryBtnClick: PropTypes.func,
  handleMapBtnClick: PropTypes.func,
};
