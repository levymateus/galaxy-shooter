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
  constructor(
    public readonly ticker: Ticker,
    public readonly stage: Container,
    public readonly screen: Rectangle,
    public readonly surface: Surface,
    public readonly bounds: Core.AxisAlignedBounds,
    public readonly emitter: utils.EventEmitter,
  ) {
    super(ticker, stage, screen, surface, bounds, emitter)
  }

  async goto(ctor: ActivityCtor): Promise<void> {
    if (!this.context?.parent) {
      return super.goto(ctor)
    }
    if (this.context) {
      this.stage.addChild(this.context)
      this.stage.sortChildren()
    }
  }
}
