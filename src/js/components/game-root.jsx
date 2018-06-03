
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';


import { Tile } from '../models/model-tile';
import { Passage } from './passage';

export class GameRoot extends Component {
  render() {

    return (
      <div className='game-root'>
        <Passage {...this.props} />
      </div>
    );
  }
}

GameRoot.propTypes = {
  tile: PropTypes.instanceOf(Tile)
};

