import { EmitterConfigV3 } from "@pixi/particle-emitter"
import { GameObject } from "core"

export interface AppEvents {
  scoreIncrement: [amount: number]
  dispathVFX: [config: EmitterConfigV3]
  gameOver: []
  outOfBounds: []
  onCollide: [other: GameObject<AppEvents>]
  appPause: [pause: boolean]
}

export type Vec2 = {
  x: number,
  y: number,
}

export interface IPickUp {
  equip(zIndex?: number): void
  unequip(): void
}
