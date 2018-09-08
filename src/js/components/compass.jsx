import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../css/components/compass.scss';

const pointerClassSuffxs = {
  n: 'north',
  e: 'east',
  s: 'south',
  w: 'west'
};

export const Compass = (props) => {
    const suffx = pointerClassSuffxs[props.direction];

    return (
      <article className="compass">
        <span className="compass_disc" />
        <span className={`compass_pointer--${suffx}`} />
      </article>
    );
};

Compass.propTypes = {
  direction: PropTypes.oneOf(['n', 'e', 's', 'w'])
};