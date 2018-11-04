
import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';

import { Tile } from '../models/model-tile';
import { Passage } from './passage';
import { GameHeader } from './game-header';
import { LevelMap } from './level-map';
import { GameMsg } from './game-msg';

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
      gameMsg: ''
    };
    this.handleMapBtnClick = this.handleMapBtnClick.bind(this);
    this.handleCloseBtnClick = this.handleCloseBtnClick.bind(this);
    this.handleMsgUpdate = this.handleMsgUpdate.bind(this);
  }

  handleMapBtnClick() {
    this.setState({
      uiState: 'map'
    });
  }

  handleCloseBtnClick() {
    this.setState({
      uiState: 'passage'
    });
  }

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
            <GameHeader directionFetcher={directionFetcher} />
            <Passage 
              currTile={currTile} 
              direction={currDir} 
              tileFetcher={tileFetcher}
              mapClickHandler={this.handleMapBtnClick}
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
      default:
        throw new TypeError('Invalid UI state in GameRoot');
    }

    return (
      <div className='game-root'>
        { gameMsgs && <GameMsg msgs={gameMsgs} />}
        { gameContent }
      </div>
    );
  }

  handleMsgUpdate() {
    const msgs = msgStore.getCurrMsgs();
    this.setState({ gameMsgs: msgs });
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile),
  tileFetcher: PropTypes.func,
  directionFetcher: PropTypes.func,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};

