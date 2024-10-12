import {
  Activity,
  ActivityCtor,
  Context,
  Core,
  Surface
} from "core"
import { Container, Rectangle, Ticker, utils } from "pixi.js"
import { ModuleManager } from "./ModuleManager"

type ManagerOptions = {
  gotoAndStart?: boolean
}

const defaultManagerOptions: ManagerOptions = {
  gotoAndStart: true
}

/**
 * Manager base class implementation.
 *
 * Handles the activity croncrete classes and the lifecycles implemented
 * by the `Activity` interface.
 *
 */
export class Manager {
  /**
   * Current running activity.
   */
  activity: Activity | null

  /**
   * The current context for the current activity.
   */
  context: Context | null

  private parent: Container

  constructor(
    public readonly ticker: Ticker,
    public readonly stage: Container,
    public readonly screen: Rectangle,
    public readonly surface: Surface,
    public readonly bounds: Core.AxisAlignedBounds,
    public readonly emitter: utils.EventEmitter,
  ) {
    this.context = null
    this.activity = null
  }

  /**
   * The `goto` method build, setup and provide a `Context` for an `Activity`.
   *
   * @details Destroy the current activity and build an another one.
   * @param ctor The Activity constructor
   */
  async goto(
    ctor: ActivityCtor,
    options: ManagerOptions = defaultManagerOptions
  ) {
    this.ticker.stop()

    await this.destroy()

    this.context = new ModuleManager().addSingleton<Context>(Context,
      this,
      this.surface,
      this.screen,
      this.bounds,
      this.emitter
    )
    this.context.name = ctor.name

    this.activity = new ctor()
    await this.activity.onStart(this.context)

    this.stage.addChild(this.context)
    this.stage.sortChildren()

    this.ticker.add(this.activity.onUpdate, this.activity)
    if (options?.gotoAndStart) this.ticker.start()
  }

  /**
   * Destroy the current activity and context.
   */
  async destroy() {
    if (this.activity && this.context) {
      this.ticker.stop()
      this.ticker.remove(this.activity.onUpdate, this.activity)

      await this.activity.onFinish()
      this.activity = null

      this.context.destroy({
        children: true,
        texture: false,
        baseTexture: false
      })
      this.context = null
    }
  }

  /**
   * Removes the context from the stage.
   */
  suspend() {
    if (this.context) {
      this.parent = this.context.parent
      this.context.removeFromParent()
    }
  }

  /**
   * Adds the context on the stage.
   */
  unsusped() {
    if (this.context && this.parent) {
      this.parent.addChild(this.context)
    }
  }

  setIndex(index: number) {
    if (this.context) {
      this.context.zIndex = index
      this.stage.sortChildren()
    }
  }
}
