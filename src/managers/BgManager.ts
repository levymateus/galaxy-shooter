import {
  Core,
  EventEmitter,
  Surface,
  ActivityCtor,
  Manager
} from "core"
import { Container, Rectangle, Ticker } from "pixi.js"
import { AppEvents } from "typings"

/**
 * Game Background Manager.
 */
export class BgManager extends Manager<AppEvents> {
  suspended: boolean

  constructor(
    ticker: Ticker,
    stage: Container,
    screen: Rectangle,
    surface: Surface,
    bounds: Core.AxisAlignedBounds,
    emitter: EventEmitter<AppEvents>,
    index?: number
  ) {
    super(ticker, stage, screen, surface, bounds, emitter, index)
    this.suspended = false
  }

  async goto(ctor: ActivityCtor<AppEvents>): Promise<void> {
    if (!this.suspended) {
      return super.goto(ctor)
    }
    if (this.context) {
      this.stage.addChild(this.context)
      this.stage.sortChildren()
      this.suspended = false
    }
  }

  suspend() {
    if (this.context) {
      this.context.removeFromParent()
      this.suspended = true
    }
  }
}
