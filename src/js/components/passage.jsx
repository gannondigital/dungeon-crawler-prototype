import React, { Component } from "react";
import PropTypes from "prop-types";
import cloneDeep from "lodash.clonedeep";

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

const directionOrder = ["n", "e", "s", "w"];
const FADE_TIME = 200;

import "../../css/lib/base";
import "../../css/components/passage";

/**
 * @todo way too big, separate data provision from UI
 */
export class Passage extends Component {
  constructor(props) {
    super(props);

    const {
      direction,
      currTile,
      inCombat: initialInCombat
    } = props;

    this.state = {
      tile: currTile,
      direction: direction,
      faded: false,
      inCombat: initialInCombat,
      // @todo this doesn't belong here, it's combat related
      isCharactersTurn: false
    };
  }

  turnLeft = async () => {
    await this.fade(true);
    const currDirection = this.state.direction;
    const newDirection =
      directionOrder[(directionOrder.indexOf(currDirection) - 1 + 4) % 4];
    console.log("curr orienation: " + currDirection);
    console.log("new direction: " + newDirection);
    setDirection(newDirection);
    await this.fade(false);
  };

  turnRight = async () => {
    await this.fade(true);
    const currDirection = this.state.direction;
    const newDirection =
      directionOrder[(directionOrder.indexOf(currDirection) + 1) % 4];
    console.log("curr orienation: " + currDirection);
    console.log("new direction: " + newDirection);

    setDirection(newDirection);
    await this.fade(false);
  };

  // @todo this should live outside of ui and be passed as props
  moveAhead = async () => {
    const dirsForWalls = getDirsForWalls(this.state.direction);
    const dir = dirsForWalls.ahead;
    const tile = this.state.tile;

    if (this.state.inCombat) {
      showGameMsg("Can't get past without fighting!");
      return;
    }

    if (tile.hasExitAtWall(dir)) {
      const nextTileName = tile.getAdjacentTileName(dir);
      await this.fade(true);
      console.log("setting new tile: " + nextTileName);
      // @todo this should likely be a handler prop
      setTile(nextTileName);
      await this.fade(false);
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
        (prevState) => {
          const newState = cloneDeep(prevState);
          newState.faded = !!fadeIn;
          return newState;
        },
        async () => {
          await gameplayWait(FADE_TIME);
          resolve();
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

    // @todo ceiling and floor should be skinnable like walls
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
    // @todo random encounters would be combat that is not
    // part of the tile object -- unless implement by instantiating
    // Tiles with random monsters/or not at creation
    if (inCombat) {
      const monsters = tile.getMonsters() || [];
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

// @todo there are almost certainly better ways to do all this
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
  if (!directionOrder.includes(direction)) {
    throw new TypeError("Invalid direction set on Passage");
  }

  return dirsForWalls[direction];
};
