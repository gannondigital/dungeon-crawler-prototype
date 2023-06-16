import Tile from "../models/tile";
import levelStore from "../stores/level";
import { MonsterFactory } from "./monster-factory";

export const TileFactory = (tileName) => {
  const tileProps = levelStore.getTileData(tileName);

  const monstArr = tileProps.monsters || [];
  const monsters = monstArr.map(MonsterFactory);
  return new Tile({ ...tileProps, monsters });
};
