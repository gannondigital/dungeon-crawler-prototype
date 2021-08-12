import React, { Component, Fragment } from "react";
import { PropTypes } from "prop-types";

import { Tile } from "../models/model-tile";
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

  handleCloseBtnClick = () => {
    this.setState({
      uiState: "passage"
    });
  };

  handleInventoryClick = () => {
    this.setState({
      uiState: "inventory"
    });
  };

  // @todo DRY up back button
  render() {
    const gameMsgs = this.state.gameMsgs;
    const currDir = characterStore.getDirection();
    const currTileName = characterStore.getCurrTileName();
    const currTile = levelStore.getTile(currTileName);

    let gameContent = null;
    let backButton;
    switch (this.state.uiState) {
      case "passage":
        gameContent = (
          <Fragment>
            <GameMsg />
            <GameHeader
              button={[
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
              ]}
            />
            <Passage currTile={currTile} direction={currDir} />
          </Fragment>
        );
        break;
      case "map":
        backButton = (
          <button
            className="header-nav-button"
            onClick={this.handleCloseBtnClick}
          >
            Back
          </button>
        );
        gameContent = (
          <Fragment>
            <GameHeader button={backButton} />
            <LevelMap rows={10} columns={20} />
          </Fragment>
        );
        break;
      case "inventory":
        backButton = (
          <button
            className="header-nav-button"
            onClick={this.handleCloseBtnClick}
          >
            Back
          </button>
        );
        gameContent = (
          <Fragment>
            <GameHeader button={backButton} />
            <Inventory />
          </Fragment>
        );
        break;
      default:
        throw new TypeError("Invalid UI state in GameRoot");
    }

    return <div className="game-root">{gameContent}</div>;
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile),
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};
