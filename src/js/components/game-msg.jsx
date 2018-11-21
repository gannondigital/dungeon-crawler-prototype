import React from 'react';

import '../../css/components/game-msg';

export const GameMsg = (props) => {
  const { msgs } = props;

  let msgComponents = null;
  if (msgs && typeof msgs === 'object' && msgs.length) {
    msgComponents = msgs.map((msg) => {
      return (<p key={msg}>{msg}</p>);
    });
  }

  return (
    <div className="game-msg--text">
      { msgComponents }
    </div>
  );
};
