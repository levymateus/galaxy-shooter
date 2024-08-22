import { Point } from "pixi.js"

export type Vec2 = {
  x: number,
  y: number,
}

export interface Pickable {
  equiped(): boolean
  equip(zIndex?: number): void
  unequip(): void
}

export interface Spawner {
  spawn(point: Point): Promise<void> | void
  revoke(): Promise<void> | void
}

export interface Destructible {
  takeDamage(value: number): void
}

export interface Restorable {
  heal(value: number): void
}
