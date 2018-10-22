import React from 'react';

import '../../css/components/game-msg';

export const GameMsg = (props) => {
  const { msgText } = props;
  return (
    <p className="game-msg--text">{msgText}</p>
  );
};
