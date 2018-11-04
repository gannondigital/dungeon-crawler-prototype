import React from 'react';

import '../../css/components/game-msg';

export const GameMsg = (props) => {
  const { msgs } = props;
  const msgComponents = msgs.map((msg) => {
    return (<p className="game-msg--text" key={msg}>{msg}</p>);
  });

  return (
    msgComponents
  );
};
