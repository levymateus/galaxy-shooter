import { EmitterConfigV3 } from "@pixi/particle-emitter"
import { AbstractGameObject } from "core"

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
