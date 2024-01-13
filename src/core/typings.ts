import { Context } from "core"
import { AssetsManifest, Container, Resource, Texture, utils } from "pixi.js"

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

export type Textures = Texture<Resource>[]

export type ActivityElement<
  E extends utils.EventEmitter.ValidEventTypes
> = Container & Activity<E>

export enum Actions {
  MOVE_UP = "MOVE_UP",
  MOVE_DOWN = "MOVE_DOWN",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  WEAPON_FIRE = "WEAPON_FIRE",
}

/**
 * The `Activity` implements a basic lifecycles behaviour,
 * managed by a `Manager`, providing a `Context` to the children.
 */
export interface Activity<E extends utils.EventEmitter.ValidEventTypes> {
  onStart(context: Context<E>, ...args: unknown[]): Promise<void>
  onUpdate(delta: number): void
  onFinish(): Promise<void>
}

export interface ActivityCtor<E extends utils.EventEmitter.ValidEventTypes> {
  new(): Activity<E>
}

export interface ActivityElementCtor<
  E extends utils.EventEmitter.ValidEventTypes
> {
  new(ctx: Context<E>, name: string): ActivityElement<E>
}

export interface InputEvents {
  onActionPressed: [action: Actions]
  onActionReleased: [action: Actions]
}
