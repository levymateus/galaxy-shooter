import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter"
import {
  Core,
  Surface,
  Manager,
  ActivityCtor
} from "core"
import { Container, Rectangle, Ticker, utils } from "pixi.js"

/**
 * Game Visual Effects Manager.
 */
export default class VFXManager extends Manager {
  /**
   * `stopped` pause the particle emitter when `true`.
   * the default values is `true`.
   */
  stopped: boolean

  constructor(
    public readonly ticker: Ticker,
    public readonly stage: Container,
    public readonly screen: Rectangle,
    public readonly surface: Surface,
    public readonly bounds: Core.AxisAlignedBounds,
    public readonly emitter: utils.EventEmitter,
  ) {
    super(ticker, stage, screen, surface, bounds, emitter)
    this.stopped = true
  }

  async goto(ctor: ActivityCtor): Promise<void> {
    await super.goto(ctor)
    /**
     * The error:
     * `Uncaught TypeError: currentTarget.isInteractive is not a function`
     * occur when a mouse event is fired and this Emitter is running on.
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
