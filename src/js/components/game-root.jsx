
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';


import { Tile } from '../models/model-tile';
import { Passage } from './passage';
import { GameHeader } from './game-header';

import '../../css/components/game-root.scss';

export class GameRoot extends Component {
  render() {

    return (
      <div className='game-root'>
        <GameHeader directionFetcher={this.props.directionFetcher} />
        <Passage 
          initialTile={this.props.initialTile} 
          direction={this.props.direction} 
          tileFetcher={this.props.tileFetcher}
          directionFetcher={this.props.directionFetcher} 
        />
      </div>
    );
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile),
  direction: PropTypes.oneOf(['n', 'e', 's', 'w']),
  tileFetcher: PropTypes.func,
  directionFetcher: PropTypes.func,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};

