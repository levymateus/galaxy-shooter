import { Vec, VecRange } from "./typings";

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toString());
}

export function randVec(vecRange: VecRange): Vec {
  const [minX, maxX, minY, maxY] = vecRange;
  return { x: randFloat(minX, maxX), y: randFloat(minY, maxY) }
}
