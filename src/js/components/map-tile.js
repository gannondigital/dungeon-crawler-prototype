import React from "react";
import classnames from "classnames";

import "../../css/components/map-tile.scss";

// @todo is it weird to foward a 'key' like this, should
// MapTile generate its own key from props...?
export const MapTile = (props) => {
  const { isEmpty, isCurrTile, cellKey, tile } = props;

  const tileName = tile && tile.getName();
  const classes = classnames(
    tileName,
    "map-tile",
    { "map-tile-empty": isEmpty },
    { "map-tile-current": isCurrTile }
  );
  return <td key={cellKey} className={classes} />;
};
