export const getTilenameForDirection = (direction, coords) => {
  if (!direction || ["n", "e", "s", "w"].indexOf(direction) === -1) {
    throw new TypeError("Invalid direction passed to getTilenameForDirection.");
  }

  const newCoords = Object.assign({}, coords);
  switch (direction) {
    case "n":
      newCoords.y--;
    case "e":
      newCoords.x++;
    case "s":
      newCoords.y++;
    case "w":
      newCoords.x--;
    default:
      throw new ReferenceError("Invalid direction, should be unreachable!");
  }

  return `${newCoords.x}x${newCoords.y}`;
};
