import React, { Component, Fragment } from "react";
import { PropTypes } from "prop-types";

import { Tile } from "../models/model-tile";
import { Passage } from "./passage";
import { GameHeader } from "./game-header";
import { LevelMap } from "./level-map";
import { GameMsg } from "./game-msg";
import { Inventory } from "./inventory";

import { characterStore } from "../stores/store-character";
import { levelStore } from "../stores/store-level";
import { msgStore } from "../stores/store-messages";

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

  handleMsgUpdate = () => {
    const msgs = msgStore.getCurrMsgs();
    this.setState({ gameMsgs: msgs });
  };

  handleInventoryClick = () => {
    this.setState({
      uiState: "inventory"
    });
  };

  componentWillMount() {
    msgStore.listen(this.handleMsgUpdate);
  }

  // @todo DRY up back button
  render() {
    const { directionFetcher, tileFetcher } = this.props;
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
            {gameMsgs && <GameMsg msgs={gameMsgs} />}
            <GameHeader
              directionFetcher={directionFetcher}
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
            <Passage
              currTile={currTile}
              direction={currDir}
              tileFetcher={tileFetcher}
            />
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
            <GameHeader
              button={backButton}
              directionFetcher={directionFetcher}
            />
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
            <GameHeader
              button={backButton}
              directionFetcher={directionFetcher}
            />
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
  tileFetcher: PropTypes.func,
  directionFetcher: PropTypes.func,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};
