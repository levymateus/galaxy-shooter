import {
  Activity,
  Context,
  Core,
  Manager,
  Surface
} from "core"
import { Container, Rectangle, Ticker, UPDATE_PRIORITY, utils } from "pixi.js"

/**
 * Game Stage Scenes Manager.
 */
export class SceneManager extends Manager {
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
}

export class Scene implements Activity {
  context: Context
  boundingArea: Core.AxisAlignedBounds

  async onStart(ctx: Context) {
    this.context = ctx

    await import("@pixi/math-extras")

    this.boundingArea = ctx.bounds.clone().pad(32, 32) as Core.AxisAlignedBounds
    this.context.getManager()
      .ticker.add(this.boundsUpdate, this, UPDATE_PRIORITY.UTILITY)
  }

  private boundsUpdate() {
    this.context.children.forEach((child) => {
      if (!this.boundingArea.contains(child.position.x, child.position.y)) {
        child.destroy({ children: true })
      }
    })
  }

  onUpdate(_: number): void {
    throw new Error("Method not implemented.")
  }

  async onFinish(): Promise<void> {
    this.context.removeAllListeners()
  }
}
