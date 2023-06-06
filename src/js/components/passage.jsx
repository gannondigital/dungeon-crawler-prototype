import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import levelStore from "../stores/level";
import characterStore from "../stores/character";
import combatStore from "../stores/combat";

import { setDirection, setTile } from "../actions/character";
import { showGameMsg } from "../actions/messages";

import { Wall } from "./wall";
import { Monster } from "./monster";
import { CombatControls } from "./combat-controls";
import PassageControls from "./passage-controls";
import Tile from "../models/tile";
import { gameplayWait } from "../lib/util";
import { DIRECTIONS } from "../constants";

const FADE_TIME = 200;

import "../../css/lib/base";
import "../../css/components/passage";

const PassageProvider = () => {
  const currTileObj = levelStore.getTile(characterStore.getCurrTileName());

  const [currTile, setCurrTile] = useState(currTileObj);
  const [currDirection, setCurrDirection] = useState(
    characterStore.getDirection()
  );
  const [inCombat, setInCombat] = useState(combatStore.isInCombat());
  const [isCharactersTurn, setIsCharactersTurn] = useState(
    combatStore.isCharactersTurn()
  );

  // @todo only call setters if value is different so as not to force render
  const handleCharacterUpdate = () => {
    setCurrDirection(characterStore.getDirection());
    // const newTileObj = levelStore.getTile(characterStore.getCurrTileName());
    setCurrTile(() => {
      const newTile = levelStore.getTile(characterStore.getCurrTileName());
      return newTile;
    });
  };
  const handleCombatUpdate = useCallback(() => {
    setInCombat(combatStore.isInCombat());
    setIsCharactersTurn(combatStore.isCharactersTurn());
  }, []);

  // @todo genericize
  useEffect(() => {
    characterStore.listen(handleCharacterUpdate);
    combatStore.listen(handleCombatUpdate);
    return () => {
      characterStore.stopListening(handleCharacterUpdate);
      combatStore.stopListening(handleCombatUpdate);
    };
  }, []);

  const handleTurnLeft = useCallback(async () => {
    const newDirection =
      DIRECTIONS[(DIRECTIONS.indexOf(currDirection) - 1 + 4) % 4];
    setDirection(newDirection);
  }, [currDirection, currTile]);

  const handleTurnRight = useCallback(async () => {
    const newDirection =
      DIRECTIONS[(DIRECTIONS.indexOf(currDirection) + 1) % 4];
    setDirection(newDirection);
  }, [currDirection, currTile]);

  const handleMoveAhead = useCallback(() => {
    const dir = getDirsForWalls(currDirection).ahead;

    if (inCombat) {
      showGameMsg("Can't get past without fighting!");
      return;
    }

    if (currTile.hasExitAtWall(dir)) {
      const nextTileName = currTile.getAdjacentTileName(dir);
      setTile(nextTileName);
    } else {
      console.log("You can't go that way.");
    }
  }, [currDirection, inCombat, currTile, setTile]);

  return (
    <Passage
      currTile={currTile}
      inCombat={inCombat}
      direction={currDirection}
      isCharactersTurn={isCharactersTurn}
      onTurnLeft={handleTurnLeft}
      onTurnRight={handleTurnRight}
      onMoveAhead={handleMoveAhead}
    />
  );
};

export const Passage = ({
  direction,
  currTile,
  inCombat,
  isCharactersTurn,
  // @todo make this level config
  defaultSurfaces = ["stonebrick", "shadow"],
  onTurnLeft,
  onTurnRight,
  onMoveAhead,
}) => {
  const [isFaded, setIsFaded] = useState(false);

  // @todo there is likely a more elegant way to do this
  const fade = (isFaded) => {
    return new Promise((resolve) => {
      setIsFaded(isFaded);
      // wait for css animation to execute
      gameplayWait(FADE_TIME).then(resolve);
    });
  };

  const { right, left, ahead } = getDirsForWalls(direction);
  // @todo review
  if (!(currTile instanceof Tile)) {
    console.log("Invalid Tile in Passage state.");
    return <div className="passagenotile" />;
  }

  // @todo use classnames pkg
  const overlayClass = isFaded ? " show" : "";

  // @todo ceiling and floor should be skinnable like walls
  const propsCeiling = {
    placement: "psg-ceiling",
    surfaces: defaultSurfaces,
  };
  const propsFloor = {
    placement: "psg-floor",
    surfaces: defaultSurfaces,
  };
  const propsRightWall = {
    placement: "psg-right",
    surfaces: currTile.getSurfacesForWall(right),
  };
  const propsLeftWall = {
    placement: "psg-left",
    surfaces: currTile.getSurfacesForWall(left),
  };
  const propsAhead = {
    placement: "psg-ahead",
    surfaces: currTile.getSurfacesForWall(ahead),
  };

  let monsterElems = null;
  // @todo random encounters would be combat that is not
  // part of the tile object -- unless implement by instantiating
  // Tiles with random monsters/or not at creation
  if (inCombat) {
    const monsters = currTile.getMonsters() || [];
    monsterElems = monsters.map((monster) => {
      return <Monster monster={monster} key={monster.getName()} />;
    });
  }

  // @todo there should be a 'changePassageView' or something
  // that abstracts out the fading and takes a callback
  // @todo when onMoveAhead is an invalid action there should be
  // no fading
  const handleLeftClick = useCallback(async () => {
    await fade(true);
    onTurnLeft();
    await fade(false);
  }, [onTurnLeft, direction, currTile]);
  const handleRightClick = useCallback(async () => {
    await fade(true);
    onTurnRight();
    await fade(false);
  }, [onTurnRight, direction, currTile]);
  const handleForwardClick = useCallback(async () => {
    await fade(true);
    onMoveAhead();
    await fade(false);
  }, [onMoveAhead, direction, currTile]);

  return (
    <div className="passageroot">
      <div className="passagewrap">
        <div className="passage">
          <Wall {...propsCeiling} />
          <Wall {...propsFloor} />
          <Wall {...propsRightWall} />
          <Wall {...propsLeftWall} />
          <Wall {...propsAhead} />
        </div>
        {monsterElems}
      </div>
      <div className={`passageoverlay${overlayClass}`} />
      {inCombat && isCharactersTurn && <CombatControls />}
      <PassageControls
        leftClickHandler={handleLeftClick}
        forwardClickHandler={handleForwardClick}
        rightClickHandler={handleRightClick}
      />
    </div>
  );
};
export default PassageProvider;

Passage.propTypes = {
  currTile: PropTypes.instanceOf(Tile).isRequired,
  direction: PropTypes.oneOf(DIRECTIONS).isRequired,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string),
  inCombat: PropTypes.bool,
  isCharactersTurn: PropTypes.bool,
  onTurnLeft: PropTypes.func,
  onTurnRight: PropTypes.func,
  onMoveAhead: PropTypes.func,
};

// @todo there are almost certainly better ways to do all this
const dirsForWalls = {
  n: {
    ahead: "n",
    right: "e",
    left: "w",
  },
  e: {
    ahead: "e",
    right: "s",
    left: "n",
  },
  s: {
    ahead: "s",
    right: "w",
    left: "e",
  },
  w: {
    ahead: "w",
    right: "n",
    left: "s",
  },
};

// the only thing this fn does is validate input, scrap
// @todo assumes north is the original forward dir
const getDirsForWalls = (direction) => {
  if (!DIRECTIONS.includes(direction)) {
    throw new TypeError("Invalid direction set on Passage");
  }

  return dirsForWalls[direction];
};
