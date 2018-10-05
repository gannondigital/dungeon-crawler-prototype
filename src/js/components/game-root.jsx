
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';


import { Tile } from '../models/model-tile';
import { Passage } from './passage';
import { GameHeader } from './game-header';
import { LevelMap } from './level-map';

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
    switch(this.state.uiState) {
      case 'passage':
        return (
          <div className='game-root'>
            <GameHeader directionFetcher={this.props.directionFetcher} />
            <Passage 
              initialTile={this.props.initialTile} 
              direction={this.props.direction} 
              tileFetcher={this.props.tileFetcher}
              directionFetcher={this.props.directionFetcher} 
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
  direction: PropTypes.oneOf(['n', 'e', 's', 'w']),
  tileFetcher: PropTypes.func,
  directionFetcher: PropTypes.func,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};

