import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { MapTile } from "./map-tile";
import characterStore from "../../stores/character";
import { TileFactory } from "../../factories/tile-factory";
import "../../../css/components/LevelMap/level-map.scss";
import config from "../../config/default.json";
import GameMsg from "../Passage/game-msg";
const { levelMapRows, levelMapColumns } = config;

function getTilename(row, column) {
  return `${column}x${row}`;
}

const LevelMapProvider = () => (
  <LevelMap rows={levelMapRows} columns={levelMapColumns} />
);
export default LevelMapProvider;

const LevelMapColumn = ({ currRow, currCol }) => {
  const tileName = getTilename(currRow, currCol);
  let mapTile;
  try {
    mapTile = TileFactory(tileName);
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
      newColEls.push(
        <LevelMapColumn
          key={`${currCol}x${currRow}`}
          currCol={currCol}
          currRow={currRow}
        />
      );
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

export const LevelMap = ({ rows, columns }) => {
  let currRow = 1;
  let [mapEls, setMapEls] = useState([]);

  useEffect(() => {
    const newMapEls = [];
    while (currRow <= rows) {
      newMapEls.push(
        <LevelMapRow
          key={`${columns}x${currRow}`}
          currRow={currRow}
          columns={columns}
        />
      );
      currRow++;
    }
    setMapEls(newMapEls);
  }, [rows, columns]);

  // @todo show direction arrow in LevelMap so player can match
  // first person orientation with map direction
  return (
    <>
      <GameMsg />
      <div className="level-map-wrapper">
        <table>
          <tbody>{mapEls}</tbody>
        </table>
      </div>
    </>
  );
};
LevelMap.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};
