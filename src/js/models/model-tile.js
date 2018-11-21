import cloneDeep from 'lodash.cloneDeep';

import { Monster } from './model-monster.js';

export class Tile {

  constructor(tileProps) {
    if (!validateTileProps(tileProps)) {
      throw new TypeError('Invalid tileProps passed to Tile constructor.');
    }

    const { walls, coords, monsters } = tileProps;
    this.walls = walls;
    this.coords = coords;
    this.name = nameFromCoords(coords);
    this.monsters = monsters;
  }

  getName() {
    return this.name;
  }

  // assumes level data is valid, and there are no exits to nonexistent tiles
  getAdjacentTileName(direction) {
    let coords;
    switch (direction) {
      case 'n':
        coords = {x: this.coords.x, y: this.coords.y - 1};
        break;
      case 'e':
        coords = {x: this.coords.x + 1, y: this.coords.y};
        break;
      case 's':
        coords = {x: this.coords.x, y: this.coords.y + 1}
        break;
      case 'w': 
        coords = {x: this.coords.x - 1, y: this.coords.y};
        break;
      default:
        throw new ReferenceError('Invalid direction passed to getAdjacentTileName.');
    }

    return nameFromCoords(coords);
  }

  getSurfacesForWall(direction) {
    const wall = this.walls[direction]
    if (typeof wall === 'undefined') {
      throw new ReferenceError('Invalid direction passed to getSurfacesForWall.');
    }

    return cloneDeep(wall.surfaces);
  }

  hasExitAtWall(direction) {
    const wall = this.walls[direction];
    if (typeof wall === 'undefined') {
      throw new ReferenceError('Invalid direction passed to hasExitAtWall.');
    }

    return !!wall.exit;
  }

  getMonsters() {
    return cloneDeep(this.monsters);
  }

}

const nameFromCoords = (coords) => {
  return `${coords.x}x${coords.y}`
};

const validateTileProps = (tileProps) => {
  let isValid = isValidWallProps(tileProps.walls);
  isValid = isValid && isValidCoords(tileProps.coords);
  isValid = isValid && isValidMonsterProps(tileProps.monsters);
  return isValid;
};

const isValidCoords = (coords) => {
  if (typeof coords !== 'object' || !coords) {
    return false;
  }

  if ( typeof coords.x !== 'number' || typeof coords.y !== 'number' ||
    isNaN(coords.x) || isNaN(coords.y) ) {
    return false;
  }

  return true;
};

const isValidWallProps = (walls) => {
  if (typeof walls !== 'object' || !walls) {
    return false;
  }

  const hasCorrectKeys = ['n', 'e', 's', 'w'].reduce((lastVal, currProp) => {

    return !!(lastVal && typeof walls[currProp] === 'object' && walls[currProp]);
  }, 'n');
  return hasCorrectKeys;
};

export const isValidMonsterProps = (monsterProps) => {
  if (typeof monsterProps === 'undefined') {
    return true; // allow absent monsters prop
  }

  if (!(monsterProps instanceof Array)) {
    return false;
  }
  return monsterProps.reduce((accum, monster) => {
    return accum && !!(monster instanceof Monster);
  }, true);
};

