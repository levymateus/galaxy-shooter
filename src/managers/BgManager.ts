import {
  ActivityCtor,
  Core,
  Manager,
  Surface
} from "core"
import { Container, Rectangle, Ticker, utils } from "pixi.js"

/**
 * Game Background Manager.
 */
export class BgManager extends Manager {
  suspended: boolean

  constructor(
    public readonly ticker: Ticker,
    public readonly stage: Container,
    public readonly screen: Rectangle,
    public readonly surface: Surface,
    public readonly bounds: Core.AxisAlignedBounds,
    public readonly emitter: utils.EventEmitter,
  ) {
    super(ticker, stage, screen, surface, bounds, emitter)
    this.suspended = false
  }

  async goto(ctor: ActivityCtor): Promise<void> {
    if (!this.suspended) {
      return super.goto(ctor)
    }
    if (this.context) {
      this.stage.addChild(this.context)
      this.stage.sortChildren()
      this.suspended = false
    }
  }
}
