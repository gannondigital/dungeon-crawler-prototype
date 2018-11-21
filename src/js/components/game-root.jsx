
import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';

import { Tile } from '../models/model-tile';
import { Passage } from './passage';
import { GameHeader } from './game-header';
import { LevelMap } from './level-map';
import { GameMsg } from './game-msg';
import { Inventory } from './inventory';

import { characterStore } from '../stores/store-character';
import { levelStore } from '../stores/store-level';
import { msgStore } from '../stores/store-messages';

import '../../css/lib/base.scss';
import '../../css/components/game-root.scss';

export class GameRoot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uiState: 'passage',
      gameMsgs: []
    };
  }

  handleMapBtnClick = () => {
    this.setState({
      uiState: 'map'
    });
  };

  handleCloseBtnClick = () => {
    this.setState({
      uiState: 'passage'
    });
  };

  handleMsgUpdate = () => {
    const msgs = msgStore.getCurrMsgs();
    this.setState({ gameMsgs: msgs });
  };

  handleInventoryClick = () => {
    this.setState({
      uiState: 'inventory'
    });
  };

  componentWillMount() {
    msgStore.listen(this.handleMsgUpdate);
  }

  render() {
    const {
      directionFetcher,
      tileFetcher
    } = this.props;
    const gameMsgs = this.state.gameMsgs;
    const currDir = characterStore.getDirection();
    const currTileName = characterStore.getCurrTileName();
    const currTile = levelStore.getTile(currTileName);

    let gameContent = null;
    switch(this.state.uiState) {
      case 'passage':
        gameContent = (
          <Fragment>
            { gameMsgs && <GameMsg msgs={gameMsgs} />}
            <GameHeader directionFetcher={directionFetcher} />
            <Passage 
              currTile={currTile} 
              direction={currDir} 
              tileFetcher={tileFetcher}
              mapClickHandler={this.handleMapBtnClick}
              inventoryClickHandler={this.handleInventoryClick}
            />
          </Fragment>
        );
        break;
      case 'map':
        gameContent = (
          <Fragment>
            <LevelMap 
              rows={20} 
              columns={20}
              closeClickHandler={this.handleCloseBtnClick}
            />
          </Fragment>
        );
        break;
      case 'inventory':
        gameContent = (
          <Fragment>
            <Inventory
              closeClickHandler={this.handleCloseBtnClick}
            />
          </Fragment>
        );
        break;
      default:
        throw new TypeError('Invalid UI state in GameRoot');
    }

    return (
      <div className='game-root'>
        { gameContent }
      </div>
    );
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile),
  tileFetcher: PropTypes.func,
  directionFetcher: PropTypes.func,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};

