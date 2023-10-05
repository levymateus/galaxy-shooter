import { Point, RAD_TO_DEG } from "@pixi/math";
import GameObject from "core/GameObject";

export function randi(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randf(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toString());
}

export function angleBetween(a: Point, b: Point): number {
  const dist = new Point(b.x, b.y).subtract(a);
  const angle = Math.atan2(dist.y, dist.x) * RAD_TO_DEG;
  return angle;
}

export function dice(sides: number) {
  const dice = {
    sides: sides,
    roll: () => {
      return Math.floor(Math.random() * sides) + 1
    }
  }
  return dice;
}

/**
 * Validates a collision/collisor.
 * @param names - The name of the valid collisors.
 * @param collisor - The testing collisor.
 * @returns `true` for valid or `false`.
 */
export const isValidCollisor = (names: string[], collisor: GameObject): boolean =>
  names.some(name => collisor.name.includes(name));

export const uid = (): string => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const DOWN = new Point(0, 1);
