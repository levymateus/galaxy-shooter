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

  private parent: Container

  constructor(
    public readonly ticker: Ticker,
    public readonly stage: Container,
    public readonly screen: Rectangle,
    public readonly surface: Surface,
    public readonly bounds: Core.AxisAlignedBounds,
    public readonly emitter: utils.EventEmitter,
    index?: number
  ) {
    super(ticker, stage, screen, surface, bounds, emitter, index)
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

  suspend() {
    if (this.context) {
      this.parent = this.context.parent
      this.context.removeFromParent()
      this.suspended = true
    }
  }

  unsusped() {
    if (this.context && this.parent) {
      this.parent.addChild(this.context)
    }
  }
}
