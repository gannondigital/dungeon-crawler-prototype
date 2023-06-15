import React from "react";
import classnames from "classnames";

import "../../../css/components/LevelMap/map-tile.scss";

// @todo should this component just accept a `tileName` prop
// instead of `tile`?
export const MapTile = (props) => {
  const { isEmpty, isCurrTile, tile } = props;

  const tileName = tile && tile.getName();
  const classes = classnames(
    tileName,
    "map-tile",
    { "map-tile-empty": isEmpty },
    { "map-tile-current": isCurrTile }
  );
  return <td className={classes} />;
};
