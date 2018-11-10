import React from 'react';

import '../../css/components/game-msg';

export const GameMsg = (props) => {
  const { msgs } = props;

  let msgComponents = null;
  if (msgs && typeof msgs === 'object' && msgs.length) {
    msgComponents = msgs.map((msg) => {
      return (<p className="game-msg--text" key={msg}>{msg}</p>);
    });
  }

  return (
    msgComponents
  );
};
