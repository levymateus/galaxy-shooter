import { Point } from "pixi.js"
import { EventNamesEnum } from "./enums"

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

export type EventTypes = {
  [EventNamesEnum.SCORE_INC]: [{ amount: number, x: number, y: number }],
  [EventNamesEnum.GOTO_GAME_OVER]: void,
  [EventNamesEnum.START_GAME]: void,
  [EventNamesEnum.GOTO_MAIN_MENU]: void,
  [EventNamesEnum.DISPATCH_VFX]: void,
}
