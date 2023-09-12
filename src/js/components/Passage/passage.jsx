import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import characterStore from "../../stores/character";
import combatStore from "../../stores/combat";

import { setDirection, setTile } from "../../actions/character";
import { showGameMsg } from "../../actions/messages";
import { useStoreSubscription } from "../../hooks";
import Tile from "../../models/tile";
import { gameplayWait } from "../../lib/util";

import GameMsg from "./game-msg";
import { Wall } from "./wall";
import PassageControls from "./passage-controls";
import { Monster } from "./Combat/monster";
import CombatControls from "./Combat/combat-controls";

import { DIRECTIONS } from "../../constants";
import { DIRS_FOR_WALLS } from "../../constants/passageview";
import config from "../../config/default.json";

const { defaultSurfaces, uiDelayTimeMs } = config;

import "../../../css/lib/base";
import "../../../css/components/Passage/passage";
import { TileFactory } from "../../factories/tile-factory";

// the only thing this fn does is validate input, scrap
// @todo assumes north is the original forward dir
const getDirsForWalls = (direction) => {
  if (!DIRECTIONS.includes(direction)) {
    throw new TypeError("Invalid direction set on Passage");
  }

  return DIRS_FOR_WALLS[direction];
};

const PassageProvider = () => {
  const currTileObj = TileFactory(characterStore.getCurrTileName());
  const [currTile, setCurrTile] = useState(currTileObj);
  const [currDirection, setCurrDirection] = useState(
    characterStore.getDirection()
  );
  const [inCombat, setInCombat] = useState(combatStore.isInCombat());
  const [isCharactersTurn, setIsCharactersTurn] = useState(
    combatStore.isCharactersTurn()
  );

  // @todo only call setters if value is different so as not to force render
  const handleCharacterUpdate = useCallback(() => {
    setCurrDirection(characterStore.getDirection());
    setCurrTile(() => {
      const newTile = TileFactory(characterStore.getCurrTileName());
      return newTile;
    });
  }, [characterStore, TileFactory, setCurrDirection, setCurrTile]);
  const handleCombatUpdate = useCallback(() => {
    setInCombat(combatStore.isInCombat());
    setIsCharactersTurn(combatStore.isCharactersTurn());
  }, [setInCombat, setIsCharactersTurn, combatStore]);

  useStoreSubscription([
    [characterStore, handleCharacterUpdate],
    [combatStore, handleCombatUpdate],
  ]);

  const handleTurnLeft = useCallback(async () => {
    const newDirection =
      DIRECTIONS[(DIRECTIONS.indexOf(currDirection) - 1 + 4) % 4];
    setDirection(newDirection);
  }, [currDirection, setDirection]);

  const handleTurnRight = useCallback(async () => {
    const newDirection =
      DIRECTIONS[(DIRECTIONS.indexOf(currDirection) + 1) % 4];
    setDirection(newDirection);
  }, [currDirection, setDirection]);

  const validateMoveAhead = useCallback(() => {
    if (inCombat) {
      showGameMsg("Can't get past without fighting!");
      return false;
    }

    const dir = getDirsForWalls(currDirection).ahead;
    if (!currTile.hasExitAtWall(dir)) {
      showGameMsg("Can't go that way.");
      return false;
    }
    return true;
  }, [inCombat, showGameMsg, currDirection, currTile]);

  const handleMoveAhead = useCallback(() => {
    const dir = getDirsForWalls(currDirection).ahead;
    const nextTileName = currTile.getAdjacentTileName(dir);
    setTile(nextTileName);
  }, [currDirection, currTile, setTile]);

  return (
    <>
      <GameMsg />
      <Passage
        currTile={currTile}
        inCombat={inCombat}
        direction={currDirection}
        isCharactersTurn={isCharactersTurn}
        onTurnLeft={handleTurnLeft}
        onTurnRight={handleTurnRight}
        onMoveAhead={handleMoveAhead}
        validateMoveAhead={validateMoveAhead}
      />
    </>
  );
};
export default PassageProvider;

export const Passage = ({
  direction,
  currTile,
  inCombat,
  isCharactersTurn,
  onTurnLeft,
  onTurnRight,
  onMoveAhead,
  validateMoveAhead,
}) => {
  const [isFaded, setIsFaded] = useState(false);
  const { right, left, ahead } = getDirsForWalls(direction);
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

  let monsterElems = [];
  // @todo random encounters would be combat that is not
  // part of the tile object -- unless implement by instantiating
  // Tiles with random monsters/or not at creation
  if (inCombat) {
    const monsters = currTile.getMonsters() || [];
    monsterElems = monsters.map((monster) => {
      return <Monster monster={monster} key={monster.getName()} />;
    });
  }

  const fade = (isFaded) => {
    return new Promise((resolve) => {
      setIsFaded(isFaded);
      // wait for css animation to execute
      gameplayWait(uiDelayTimeMs).then(resolve);
    });
  };

  const changePassageView = async (updateFn) => {
    await fade(true);
    updateFn();
    await fade(false);
  };

  if (!(currTile instanceof Tile)) {
    console.log("Invalid Tile in Passage state.");
    return <div className="passagenotile" />;
  }

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
        onTurnLeft={onTurnLeft}
        onTurnRight={onTurnRight}
        onMoveAhead={onMoveAhead}
        validateMoveAhead={validateMoveAhead}
        changePassageView={changePassageView}
      />
    </div>
  );
};

Passage.propTypes = {
  currTile: PropTypes.instanceOf(Tile).isRequired,
  direction: PropTypes.oneOf(DIRECTIONS).isRequired,
  inCombat: PropTypes.bool.isRequired,
  isCharactersTurn: PropTypes.bool.isRequired,
  onTurnLeft: PropTypes.func.isRequired,
  onTurnRight: PropTypes.func.isRequired,
  onMoveAhead: PropTypes.func.isRequired,
  validateMoveAhead: PropTypes.func.isRequired,
};
