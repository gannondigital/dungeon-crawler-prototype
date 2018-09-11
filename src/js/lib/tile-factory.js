import { Tile } from '../models/model-tile';

export const TileFactory = (tileProps) => {
  const {
    tileId
  } = tileProps;
  const monsters = getMonstersForTile(tileId);
  return new Tile({ monsters, ...tileProps});
};