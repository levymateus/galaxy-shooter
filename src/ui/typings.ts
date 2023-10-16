import { Context } from "core"
import { utils } from "pixi.js"

export enum Components {
  HUD = "HUD"
}

export interface Activity<E extends utils.EventEmitter.ValidEventTypes> {
  context: Context<E>
  onStart(context: Context<E>): Promise<void>
  onUpdate(delta: number): void
  onFinish(): Promise<void>
}
