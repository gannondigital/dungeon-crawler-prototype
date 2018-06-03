
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import cloneDeep from 'lodash.cloneDeep';

import { tileStore } from '../stores/store-tile';
import { setTile } from '../actions/actions-tile';
import { levelStore } from '../stores/store-level';
import { characterStore } from '../stores/store-character';
import { setDirection } from '../actions/actions-character';
import { Wall } from './wall';
import { PassageControls } from './passage-controls';
import { Tile } from '../models/model-tile';
import { getTilenameForDirection } from '../lib/util/get-tilename-for-direction';

const directionOrder = ['n', 'e', 's', 'w'];
const fadeTime = 100;

import '../../css/lib/base';
import '../../css/components/passage';

export class Passage extends Component {

  static defaultProps = {
    defaultSurfaces: [
      'stonebrick',
      'shadow'
    ]
  }

  static propTypes = {
    tile: PropTypes.instanceOf(Tile)
  }

  constructor(props) {
    super(props)
    this.state = {
      tile: props.tile,
      direction: props.direction,
      faded: false
    };
    this.turnLeft = this.turnLeft.bind(this);
    this.turnRight = this.turnRight.bind(this);
    this.moveAhead = this.moveAhead.bind(this);
    this.handleTileUpdate = this.handleTileUpdate.bind(this);
    this.handleDirectionUpdate = this.handleDirectionUpdate.bind(this);
  }

  componentWillMount() {
    tileStore.listen(this.handleTileUpdate);
    characterStore.listen(this.handleDirectionUpdate);
  }

  componentWillUnmount() {
    tileStore.stopListening(this.handleTileUpdate);
    characterStore.stopListening(this.handleDirectionUpdate);
  }

  handleTileUpdate() {
    const tile = tileStore.getTile();

    this.setState((prevState, currProps) => {
      const newState = Object.assign(prevState, { tile });
      return newState;
    });
  }

  handleDirectionUpdate() {
    const direction = characterStore.getDirection();

    this.setState((prevState, currProps) => {
      const newState = Object.assign(prevState, { direction });
      return newState;
    });
  }

  render() {
    const dirsForWalls = getDirsForWalls(this.state.direction);
    const tile = this.state.tile;

    const overlayClass = this.state.faded ? ' show' : '';

    const dataCeiling = {
      placement: 'psg-ceiling',
      surfaces: this.props.defaultSurfaces
    };
    const dataFloor = {
      placement: 'psg-floor',
      surfaces: this.props.defaultSurfaces
    };
    const dataRightWall = {
      placement: 'psg-right',
      surfaces: tile.getSurfacesForWall(dirsForWalls.right)
    };
    const dataLeftWall = {
      placement: 'psg-left',
      surfaces: tile.getSurfacesForWall(dirsForWalls.left)
    };
    const dataAhead = {
      placement: 'psg-ahead',
      surfaces: tile.getSurfacesForWall(dirsForWalls.ahead)
    };

    return (
      <div>
        <div className="passagewrap">
          <div className="passage">
            <Wall {...dataCeiling} />
            <Wall {...dataFloor} />
            <Wall {...dataRightWall} />
            <Wall {...dataLeftWall} />
            <Wall {...dataAhead} />
          </div>
        </div>
        <div className={`passageoverlay${overlayClass}`} />
        <PassageControls 
          leftClickHandler={this.turnLeft}
          forwardClickHandler={this.moveAhead}
          rightClickHandler={this.turnRight} 
        />
      </div>
    );
  }

  turnRight() {
    this.fadeOut().then(() => {
      const currDirection = this.state.direction;
      const newDirection = directionOrder[ (directionOrder.indexOf(currDirection) + 1) % 4 ];
      console.log('curr orienation: ' + currDirection);
      console.log('new direction: ' + newDirection);

      setDirection(newDirection);
      this.fadeIn();
    });
  }

  turnLeft() {
    this.fadeOut().then(() => {
      const currDirection = this.state.direction;
      const newDirection = directionOrder[ (directionOrder.indexOf(currDirection) - 1 + 4) % 4 ];
      console.log('curr orienation: ' + currDirection);
      console.log('new direction: ' + newDirection);

      setDirection(newDirection);

      this.fadeIn();
    });
  }

  moveAhead() {
    const dirsForWalls = getDirsForWalls(this.state.direction);
    const dir = dirsForWalls.ahead;
    const tile = this.state.tile;

    if (tile.hasExitAtWall(dir)) {
      const nextTileName = tile.getAdjacentTileName(dir);
      this.fadeOut().then(() => {
        const nextTile = levelStore.getTile(nextTileName);
        console.log('setting new tile: ' + nextTileName);
        setTile(nextTile);
        this.fadeIn();
      });
    } else {
      console.log('You can\'t go that way.');
    }
  }

  fadeOut() {
    return this.fade(true);
  }

  fadeIn() {
    return this.fade(false);
  }

  // @todo there is likely a more elegant way to do this
  fade(fadeIn) {
    return new Promise((resolve, reject) => {
      this.setState((prevState, currProps) => {
        const newState = cloneDeep(prevState);
        newState.faded = !!fadeIn;
        return newState;
      }, () => {
        setTimeout(() => {
          resolve();
        }, 200)
      });  
    });
  }

}

const dirsForWalls = {
  n: {
    ahead: 'n',
    right: 'e',
    left: 'w'
  },
  e: {
    ahead: 'e',
    right: 's',
    left: 'n'
  },
  s: {
    ahead: 's',
    right: 'w',
    left: 'e'
  },
  w: {
    ahead: 'w',
    right: 'n',
    left: 's'
  }
}

// assumes north is the original forward dir
const getDirsForWalls = (direction) => {
  if (!isValidDirection(direction)) {
    throw new TypeError('Invalid direction set on Passage');
  }

  return dirsForWalls[direction];
}

const isValidDirection = (direction) => {
  switch (direction) {
    case 'n':
    case 'e':
    case 's':
    case 'w': 
      return true;
    default:
      return false;
  }
}
