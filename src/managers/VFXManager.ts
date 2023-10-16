import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter"
import { AxisAlignedBounds, EventEmitter, Surface } from "core"
import { Manager } from "core/Manager"
import { ActivityConstructor } from "core/typings"
import { Container, Rectangle, Ticker } from "pixi.js"
import { AppEvents } from "typings"

/**
 * Game Visual Effects Manager.
 */
export default class VFXManager extends Manager<AppEvents> {
  /**
   * `stopped` pause the particle emitter when `true`.
   * the default values is `true`.
   */
  stopped: boolean

  constructor(
    ticker: Ticker,
    stage: Container,
    screen: Rectangle,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<AppEvents>,
    index?: number
  ) {
    super(ticker, stage, screen, surface, bounds, emitter, index)
    this.stopped = true
  }

  async goto(ctor: ActivityConstructor<AppEvents>): Promise<void> {
    await super.goto(ctor)
    /**
     * An error `Uncaught TypeError: currentTarget.isInteractive is not a function` occur
     * when a mouse event is fired and this Emitter is running on.
     * Then eventMode needs to be `none`.
    */
    if (this.context) {
      this.context.zIndex = 1000
      this.context.eventMode = "none"
    }
  }

  emit(config: EmitterConfigV3): void {
    if (this.stopped || !this.context) return
    const emitter = new Emitter(this.context, config)
    const update = (dt: number) => emitter.update(dt * 0.01)
    emitter.emit = true
    emitter.playOnce(() => this.ticker.remove(update, this))
    this.ticker.add(update, this)
  }

  stop(): void {
    this.stopped = true
    this.ticker.stop()
  }

  play(): void {
    this.stopped = false
    this.ticker.start()
  }
}
