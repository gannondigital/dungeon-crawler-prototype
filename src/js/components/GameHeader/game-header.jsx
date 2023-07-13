import React from "react";
import PropTypes from "prop-types";

import { Compass } from "./compass";

import "../../../css/components/GameHeader/game-header.scss";

export const GameHeader = ({
  handleBackBtnClick,
  handleInventoryBtnClick,
  handleMapBtnClick,
}) => {
  // @todo highlight active tab, hide back button on passageview
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
