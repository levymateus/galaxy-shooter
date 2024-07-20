import { Context } from "core"
import {
  AssetsManifest,
  Circle,
  Container,
  Graphics,
  Rectangle,
  Resource,
  Texture,
} from "pixi.js"
import { InputActionsEnum } from "./enums"

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
  onActionPressed: [action: InputActionsEnum]
  onActionReleased: [action: InputActionsEnum]
}

export interface Unique {
  id: string
  equal(u: Unique): boolean
}

export interface Collideable {
  overleaps(shape: Circle | Rectangle): boolean
}

export interface RigidBody {
  onEnterBody(collision: Collideable): void
  onCollide(collision: Collideable): void
  onExitBody(collision: Collideable): void
}

export interface Drawable {
  draw(graphics: Graphics): void
}

export interface Switchable {
  enable(): void
  disable(): void
}
