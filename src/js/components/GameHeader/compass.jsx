import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DIRECTIONS } from "../../constants";

import "../../../css/components/GameHeader/compass.scss";
import characterStore from "../../stores/character";
import { useStoreSubscription } from "../../hooks";

const pointerClassSuffxs = {
  n: "north",
  e: "east",
  s: "south",
  w: "west",
};

export const Compass = () => {
  const [currDirection, setCurrDirection] = useState(
    characterStore.getDirection()
  );

  const handleCharacterUpdate = () => {
    setCurrDirection(characterStore.getDirection());
  };

  useStoreSubscription([[characterStore, handleCharacterUpdate]]);

  if (!DIRECTIONS.includes(currDirection)) {
    throw new TypeError(`Compass received invalid direction ${currDirection}`);
  }
  const suffx = pointerClassSuffxs[currDirection];

  return (
    <article className="compass">
      <span className="compass_disc" />
      <span className={`compass_pointer--${suffx}`} />
      <span className="compass_pointer_fulcrum" />
    </article>
  );
};
