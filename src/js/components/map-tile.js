import React from 'react';
import classnames from 'classnames';

import '../../css/components/map-tile.scss';

export const MapTile = (props) => {
  const classes = classnames(
    'map-tile',
    {'map-tile-empty': props.isEmpty},
    {'map-tile-current': props.isCurrTile}
  );
  return (
    <td className={classes} />
  );
};
