import { GameObject as ConcreteGameObject, Context } from "core"
import { AssetsManifest, Circle, Point, utils } from "pixi.js"

// types
export type SceneOptions = {
  manifest?: string | AssetsManifest
}

export type Resolution = {
  width: number,
  height: number,

  /**
   * Aspect ratio pair of values.
   */
  ratio: [number, number]
}

export type GameSettings = {
  Keyboard: {
    MoveUp: string
    MoveDown: string
    MoveLeft: string
    MoveRight: string
    WeaponFire: string
  },
  Mouse: {
    WeaponFire: string
  }
}

// enums
export enum Actions {
  MOVE_UP = "MOVE_UP",
  MOVE_DOWN = "MOVE_DOWN",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  WEAPON_FIRE = "WEAPON_FIRE",
}

// interfaces
export interface Activity<E extends utils.EventEmitter.ValidEventTypes> {
  onStart(context: Context<E>): Promise<void>
  onUpdate(delta: number): void
  onFinish(): Promise<void>
}

export interface ActivityConstructor<E extends utils.EventEmitter.ValidEventTypes> {
  new(): Activity<E>
}

export interface GameObject<E extends utils.EventEmitter.ValidEventTypes> {
  onStart(context: Context<E>): Promise<void>
  onUpdate(delta: number): void
  destroy(): void
}

export interface GameObjectConstructor<E extends utils.EventEmitter.ValidEventTypes> {
  new(ctx: Context<E>, name: string): ConcreteGameObject<E>
}

export interface KinematicBody extends GameObject<object> {
  speed: Point
  collisionShape: Circle
  clone(): GameObject<object>
}

export interface InputEvents {
  onActionPressed: [action: Actions]
  onActionReleased: [action: Actions]
}
