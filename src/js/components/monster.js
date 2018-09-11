import React from 'react';

import { Monster } from '../models/monster';

export const Monster = (props) => {
  const { monster } = props;
  if ( !(monster instanceof Monster)) {
    throw new TypeError('Invalid monster obj passed to Monster component');
  }

  const img_url = monster.getImageUrl();
  return (
    <Img src={img_url} />
  );
}