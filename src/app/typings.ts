import { EmitterConfigV3 } from "@pixi/particle-emitter"
import { AbstractGameObject } from "core"
import { Point } from "pixi.js"

export interface AppEvents {
  scoreIncrement: [amount: number]
  dispathVFX: [config: EmitterConfigV3]
  gameOver: []
  outOfBounds: []
  onCollide: [other: AbstractGameObject]
  appPause: [pause: boolean]
}

export type Vec2 = {
  x: number,
  y: number,
}

export interface Pickable {
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
