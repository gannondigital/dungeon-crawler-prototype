import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MapTile } from './map-tile';
import { levelStore } from '../stores/store-level';
import { characterStore } from '../stores/store-character';

function getTilename(row, column) {
  return `${row}x${column}`;
}

export class LevelMap extends Component {
  render() {
    const mapEls = [];
    let currRow = 1;
    while (currRow <= this.props.rows) {
      mapEls.push(this.renderRow(currRow));
      currRow++;
    }

    return (
      <div className="level-map-wrapper">
        <button type="button" onClick={this.props.closeClickHandler}>
          Back
        </button>
        <table className="">
          {mapEls}
        </table>
      </div>
    );
  }

  renderRow(currRow) {
    let currCol = 1;

    const colArr = [];
    while (currCol <= this.props.columns) {
      colArr.push(this.renderCol(currCol, currRow))
      currCol++;
    }

    return (
      <tr>
        {colArr}
      </tr>
    );
  }

  renderCol(currRow, currCol) {
    const tileName = getTilename(currRow, currCol);
    let mapTile;
    try {
      mapTile = levelStore.getTile(tileName);
    } catch(err) {
      // tile has not been populated
      return <MapTile isEmpty={true} />
    }

    const currTileName = characterStore.getCurrTileName();
    const isCurrTile = !!(currTileName === tileName);
    
    return (<MapTile tile={mapTile} isCurrTile={isCurrTile} />);
  }
  
}

LevelMap.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number
};