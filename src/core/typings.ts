import { Context } from "core"
import {
  AssetsManifest,
  Circle,
  Container,
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

export interface Observable {
  on(event: string, callback: (<T>(...args: T[]) => void)): void
}

export interface Input {
  isKeyPressed(key: string): boolean
  isKeyReleased(key: string): boolean
  isKeyDown(key: string): boolean
  isKeyUp(key: string): boolean
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
  overleaps(shape: Circle): boolean
}

export interface RigidBody {
  onEnterBody(collision: Collideable): void
  onCollide(collision: Collideable): void
  onExitBody(collision: Collideable): void
}

export interface Drawable {
  draw(): void
}

export interface Switchable {
  enable(): void
  disable(): void
}

export interface Storable {
  save(): void
  restore(): void
}
