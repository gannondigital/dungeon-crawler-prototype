
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { Tile } from '../models/model-tile';
import { Passage } from './passage';
import { GameHeader } from './game-header';
import { LevelMap } from './level-map';
import { characterStore } from '../stores/store-character';
import { levelStore } from '../stores/store-level';

import '../../css/lib/base.scss';
import '../../css/components/game-root.scss';

export class GameRoot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uiState: 'passage'
    };
    this.handleMapBtnClick = this.handleMapBtnClick.bind(this);
    this.handleCloseBtnClick = this.handleCloseBtnClick.bind(this);
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

  render() {
    const {
      directionFetcher,
      tileFetcher
    } = this.props;
    const currDir = characterStore.getDirection();
    const currTileName = characterStore.getCurrTileName();
    console.log('tilename:');
    console.log(currTileName);
    const currTile = levelStore.getTile(currTileName);
    console.log(currTile);

    switch(this.state.uiState) {
      case 'passage':
        return (
          <div className='game-root'>
            <GameHeader directionFetcher={directionFetcher} />
            <Passage 
              currTile={currTile} 
              direction={currDir} 
              tileFetcher={tileFetcher}
              mapClickHandler={this.handleMapBtnClick}
            />
          </div>
        );
      case 'map':
        return (
          <div className='game-root'>
            <LevelMap 
              rows={20} 
              columns={20}
              closeClickHandler={this.handleCloseBtnClick}
            />
          </div>
        );
    }
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile),
  tileFetcher: PropTypes.func,
  directionFetcher: PropTypes.func,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};

