import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DIRECTIONS } from "../constants";

import "../../css/components/compass.scss";
import characterStore from "../stores/character";

const pointerClassSuffxs = {
  n: "north",
  e: "east",
  s: "south",
  w: "west",
};

export const Compass = ({ direction }) => {
  const [currDirection, setCurrDirection] = useState(characterStore.getDirection());

  const handleCharacterUpdate = () => {
    setCurrDirection(characterStore.getDirection())
  }

  // @todo genericize
  useEffect(() => {
    characterStore.listen(handleCharacterUpdate);
    return () => {
      characterStore.stopListening(handleCharacterUpdate);
    };
  }, []);

  if (!DIRECTIONS.includes(currDirection)) {
    throw new TypeError(`Compass received invalid direction ${currDirection}`);
  }
  const suffx = pointerClassSuffxs[currDirection];

  return (
    <article className="compass">
      <span className="compass_disc" />
      <span className={`compass_pointer--${suffx}`} />
    </article>
  );
};
