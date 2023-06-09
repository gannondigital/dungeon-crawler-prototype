import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { MapTile } from "./map-tile";
import levelStore from "../stores/level";
import characterStore from "../stores/character";

import "../../css/components/level-map.scss";

function getTilename(row, column) {
  return `${row}x${column}`;
}

const LevelMapColumn = ({ currRow, currCol }) => {
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
};
LevelMapColumn.propTypes = {
  currRow: PropTypes.number,
  currCol: PropTypes.number,
};

const LevelMapRow = ({ currRow, columns }) => {
  let currCol = 1;
  const [colEls, setColEls] = useState([]);

  useEffect(() => {
    const newColEls = [];
    while (currCol <= columns) {
      newColEls.push(<LevelMapColumn currCol={currCol} currRow={currRow} />);
      currCol++;
    }
    setColEls(newColEls);
  }, [columns, currRow]);

  return <tr key={`row-${currRow}`}>{colEls}</tr>;
};
LevelMapRow.propTypes = {
  currRow: PropTypes.number,
  columns: PropTypes.number,
};

const LevelMap = ({ rows, columns }) => {
  let currRow = 1;
  let [mapEls, setMapEls] = useState([]);

  useEffect(() => {
    const newMapEls = [];
    while (currRow <= rows) {
      newMapEls.push(<LevelMapRow currRow={currRow} columns={columns} />);
      currRow++;
    }
    setMapEls(newMapEls);
  }, [rows, columns]);

  return (
    <div className="level-map-wrapper">
      <table>
        <tbody>{mapEls}</tbody>
      </table>
    </div>
  );
};
LevelMap.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};

export default LevelMap;
