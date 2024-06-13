import { Context } from "core"
import { AssetsManifest, Container, Resource, Texture } from "pixi.js"

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

export type ActivityElement = Container & Activity

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
export interface Activity {
  onStart(context: Context, ...args: unknown[]): Promise<void>
  onUpdate(delta: number): void
  onFinish(): Promise<void>
}

export interface ActivityCtor {
  new(): Activity
}

export interface ActivityElementCtor {
  new(ctx: Context, name: string): ActivityElement
}

export interface InputEvents {
  onActionPressed: [action: Actions]
  onActionReleased: [action: Actions]
}
