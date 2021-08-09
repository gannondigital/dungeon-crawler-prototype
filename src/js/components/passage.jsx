import React, { Component } from "react";
import PropTypes from "prop-types";
import cloneDeep from "lodash.clonedeep";

import { levelStore } from "../stores/store-level";
import { characterStore } from "../stores/store-character";
import { combatStore } from "../stores/store-combat";

import { setDirection, setTile } from "../actions/actions-character";
import { startCombat } from "../actions/actions-combat";
import { showGameMsg } from "../actions/actions-messages";

import { Wall } from "./wall";
import { Monster } from "./monster";
import { CombatControls } from "./combat-controls";
import PassageControls from "./passage-controls";
import { Tile } from "../models/model-tile";
import { getTilenameForDirection } from "../lib/util/get-tilename-for-direction";
import { tileHasUndefeatedOpponents } from "../lib/combat";

const directionOrder = ["n", "e", "s", "w"];
const fadeTime = 100;

import "../../css/lib/base";
import "../../css/components/passage";

export class Passage extends Component {
  constructor(props) {
    super(props);

    const { direction, currTile } = props;

    this.state = {
      tile: currTile,
      direction: direction,
      faded: false,
      inCombat: false,
      isCharactersTurn: false
    };
  }

  turnLeft = () => {
    this.fade(true).then(() => {
      const currDirection = this.state.direction;
      const newDirection =
        directionOrder[(directionOrder.indexOf(currDirection) - 1 + 4) % 4];
      console.log("curr orienation: " + currDirection);
      console.log("new direction: " + newDirection);

      setDirection(newDirection);

      this.fade(false);
    });
  };

  turnRight = () => {
    this.fade(true).then(() => {
      const currDirection = this.state.direction;
      const newDirection =
        directionOrder[(directionOrder.indexOf(currDirection) + 1) % 4];
      console.log("curr orienation: " + currDirection);
      console.log("new direction: " + newDirection);

      setDirection(newDirection);
      this.fade(false);
    });
  };

  moveAhead = () => {
    const dirsForWalls = getDirsForWalls(this.state.direction);
    const dir = dirsForWalls.ahead;
    const tile = this.state.tile;

    if (this.state.inCombat) {
      showGameMsg("Can't get past without fighting!");
      return;
    }

    if (tile.hasExitAtWall(dir)) {
      const nextTileName = tile.getAdjacentTileName(dir);
      this.fade(true).then(() => {
        console.log("setting new tile: " + nextTileName);
        setTile(nextTileName);
        this.fade(false);
      });
    } else {
      console.log("You can't go that way.");
    }
  };

  handleCharacterUpdate = () => {
    this.handleDirectionUpdate();
    this.handleTileUpdate();
  };

  handleTileUpdate = () => {
    const newTileName = characterStore.getCurrTileName();
    const tile = levelStore.getTile(newTileName);

    this.setState((prevState, currProps) => {
      const newState = Object.assign(prevState, { tile });
      return newState;
    });
  };

  handleDirectionUpdate = () => {
    const direction = characterStore.getDirection();

    this.setState((prevState, currProps) => {
      const newState = Object.assign(prevState, { direction });
      return newState;
    });
  };

  handleCombatUpdate = () => {
    const inCombat = combatStore.isInCombat();
    const isCharactersTurn = combatStore.isCharactersTurn();

    this.setState((prevState, currProps) => {
      if (isCharactersTurn) {
        console.log("is characters turn");
      }
      const newState = Object.assign(prevState, {
        inCombat,
        isCharactersTurn
      });
      return newState;
    });
  };

  componentWillMount() {
    levelStore.listen(this.handleTileUpdate);
    characterStore.listen(this.handleCharacterUpdate);
    combatStore.listen(this.handleCombatUpdate);
  }

  componentWillUnmount() {
    levelStore.stopListening(this.handleTileUpdate);
    characterStore.stopListening(this.handleDirectionUpdate);
    combatStore.stopListening(this.handleCombatUpdate);
  }

  // @todo there is likely a more elegant way to do this
  fade(fadeIn) {
    return new Promise((resolve, reject) => {
      this.setState(
        (prevState, currProps) => {
          const newState = cloneDeep(prevState);
          newState.faded = !!fadeIn;
          return newState;
        },
        () => {
          setTimeout(() => {
            resolve();
          }, 200);
        }
      );
    });
  }

  render() {
    const dirsForWalls = getDirsForWalls(this.state.direction);
    const { tile, inCombat, isCharactersTurn } = this.state;
    const currTilename = this.state.tile.getName();

    if (!(tile instanceof Tile)) {
      console.log("Invalid Tile in Passage state.");
      return <div className="passagenotile" />;
    }

    const overlayClass = this.state.faded ? " show" : "";

    const propsCeiling = {
      placement: "psg-ceiling",
      surfaces: this.props.defaultSurfaces
    };
    const propsFloor = {
      placement: "psg-floor",
      surfaces: this.props.defaultSurfaces
    };
    const propsRightWall = {
      placement: "psg-right",
      surfaces: tile.getSurfacesForWall(dirsForWalls.right)
    };
    const propsLeftWall = {
      placement: "psg-left",
      surfaces: tile.getSurfacesForWall(dirsForWalls.left)
    };
    const propsAhead = {
      placement: "psg-ahead",
      surfaces: tile.getSurfacesForWall(dirsForWalls.ahead)
    };

    let monsterElems = null;
    const monsters = tile.getMonsters() || [];
    const thereAreMonsters = tileHasUndefeatedOpponents(tile);

    if (thereAreMonsters) {
      monsterElems = monsters.map(monster => {
        return <Monster monster={monster} key={monster.getName()} />;
      });
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
          leftClickHandler={this.turnLeft}
          forwardClickHandler={this.moveAhead}
          rightClickHandler={this.turnRight}
        />
      </div>
    );
  }
}

Passage.propTypes = {
  currTile: PropTypes.instanceOf(Tile).isRequired,
  direction: PropTypes.oneOf(["n", "e", "s", "w"]).isRequired,
  defaultSurfaces: PropTypes.arrayOf(PropTypes.string)
};

/* @todo make this a config of the level so that tile data can
  be less verbose */
Passage.defaultProps = {
  defaultSurfaces: ["stonebrick", "shadow"]
};

const dirsForWalls = {
  n: {
    ahead: "n",
    right: "e",
    left: "w"
  },
  e: {
    ahead: "e",
    right: "s",
    left: "n"
  },
  s: {
    ahead: "s",
    right: "w",
    left: "e"
  },
  w: {
    ahead: "w",
    right: "n",
    left: "s"
  }
};

// assumes north is the original forward dir
const getDirsForWalls = direction => {
  if (!isValidDirection(direction)) {
    throw new TypeError("Invalid direction set on Passage");
  }

  return dirsForWalls[direction];
};

const isValidDirection = direction => {
  switch (direction) {
    case "n":
    case "e":
    case "s":
    case "w":
      return true;
    default:
      return false;
  }
};
