export const AHEAD = "ahead";
export const RIGHT = "right";
export const LEFT = "left";
export const NORTH = "n";
export const EAST = "e";
export const SOUTH = "s";
export const WEST = "w";
export const DIRS_FOR_WALLS = {
  [NORTH]: {
    [AHEAD]: NORTH,
    [RIGHT]: EAST,
    [LEFT]: WEST,
  },
  [EAST]: {
    [AHEAD]: EAST,
    [RIGHT]: SOUTH,
    [LEFT]: NORTH,
  },
  [SOUTH]: {
    [AHEAD]: SOUTH,
    [RIGHT]: WEST,
    [LEFT]: EAST,
  },
  [WEST]: {
    [AHEAD]: WEST,
    [RIGHT]: NORTH,
    [LEFT]: SOUTH,
  },
};
