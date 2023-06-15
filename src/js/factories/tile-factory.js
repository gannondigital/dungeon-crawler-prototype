import Tile from "../models/tile";
import { MonsterFactory } from "./monster-factory";

export const TileFactory = (tileProps) => {
  const monstArr = tileProps.monsters || [];
  const monsters = monstArr.map(MonsterFactory);
  return new Tile({ ...tileProps, monsters });
};
