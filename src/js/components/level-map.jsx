import React, { Component } from "react";
import PropTypes from "prop-types";

import { MapTile } from "./map-tile";
import levelStore from "../stores/level";
import characterStore from "../stores/character";

import "../../css/components/level-map.scss";

function getTilename(row, column) {
  return `${row}x${column}`;
}

/**
 * @todo map output is borked, passages not connected
 * (unless level data in demo is borked)
 */
export default class LevelMap extends Component {
  render() {
    const mapEls = [];
    let currRow = 1;
    while (currRow <= this.props.rows) {
      mapEls.push(this.renderRow(currRow));
      currRow++;
    }

    return (
      <div className="level-map-wrapper">
        <table>
          <tbody>{mapEls}</tbody>
        </table>
      </div>
    );
  }

  renderRow(currRow) {
    let currCol = 1;

    const colArr = [];
    while (currCol <= this.props.columns) {
      colArr.push(this.renderCol(currCol, currRow));
      currCol++;
    }

    return <tr key={`row-${currRow}`}>{colArr}</tr>;
  }

  renderCol(currRow, currCol) {
    const tileName = getTilename(currRow, currCol);

    let mapTile;
    try {
      mapTile = levelStore.getTile(tileName);
    } catch (err) {
      // tile has not been populated
      return <MapTile key={tileName} isEmpty />;
    }

    const currTileName = characterStore.getCurrTileName();
    const isCurrTile = !!(currTileName === tileName);

    return <MapTile key={tileName} tile={mapTile} isCurrTile={isCurrTile} />;
  }
}

LevelMap.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};
