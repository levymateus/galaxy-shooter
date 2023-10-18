import { Point, RAD_TO_DEG } from "@pixi/math"

export function randi(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randf(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toString())
}

export function angleBetween(a: Point, b: Point): number {
  const dist = b.clone().subtract(a.clone())
  const angle = Math.atan2(dist.y, dist.x) * RAD_TO_DEG
  if (Number.isNaN(angle)) return 0
  return angle
}

export function dice(sides: number) {
  const dice = {
    sides: sides,
    roll: () => {
      return Math.floor(Math.random() * sides) + 1
    }
  }
  return dice
}

export const uid = (): string => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
