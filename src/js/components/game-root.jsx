import React, { Component, Fragment } from "react";
import { PropTypes } from "prop-types";

import Tile from "../models/tile";
import { Passage } from "./passage";
import { GameHeader } from "./game-header";
import { LevelMap } from "./level-map";
import GameMsg from "./game-msg";
import { Inventory } from "./inventory";

import characterStore from "../stores/character";
import levelStore from "../stores/level";

import "../../css/lib/base.scss";
import "../../css/components/game-root.scss";
import "../../css/components/header-nav-button";

export class GameRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uiState: "passage",
      gameMsgs: []
    };
  }

  handleMapBtnClick = () => {
    this.setState({
      uiState: "map"
    });
  };

  handleBackBtnClick = () => {
    this.setState({
      uiState: "passage"
    });
  };

  handleInventoryClick = () => {
    this.setState({
      uiState: "inventory"
    });
  };

  // @todo looks like we're keeping gameMsgs in state, or expecting
  // to, but not actually passing them to GameMsg, which currently 
  // pulls them from the store itself
  render() {
    const gameMsgs = this.state.gameMsgs;
    const currDir = characterStore.getDirection();
    const currTileName = characterStore.getCurrTileName();
    const currTile = levelStore.getTile(currTileName);

    let gameContent = null;
    let buttons = null;
    const backButton = (
      <button
        className="header-nav-button"
        onClick={this.handleBackBtnClick}
      >
        Back
      </button>
    );
  
    switch (this.state.uiState) {
      case "passage":
        buttons = [
          <button
            className="header-nav-button"
            onClick={this.handleMapBtnClick}
            key="map"
          >
            Map
          </button>,
          <button
            className="header-nav-button"
            onClick={this.handleInventoryClick}
            key="inventory"
          >
            Inventory
          </button>
        ]
        gameContent = <Passage currTile={currTile} direction={currDir} />;
        break;
      case "map":
        buttons = backButton;
        gameContent = <LevelMap rows={10} columns={20} />;
        break;
      case "inventory":
        buttons = backButton);
        gameContent = <Inventory />;
        break;
      default:
        throw new TypeError("Invalid UI state in GameRoot");
    }

    return (
      <div className="game-root">
        <GameMsg />
        <GameHeader
          button={buttons}
        />
        {gameContent}
      </div>
    );
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile),
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};
