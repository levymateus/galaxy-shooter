import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { AxisAlignedBounds, EventEmitter, Surface } from "core";
import { Manager } from "core/Manager";
import { Activity } from "core/SceneManager";
import { Application, utils } from "pixi.js";

export default class VFXManager<E extends utils.EventEmitter.ValidEventTypes> extends Manager<E> {
  /**
   * `stopped` pause the particle emitter when `true`.
   * the default values is `true`.
   */
  public stopped: boolean;

  constructor(app: Application, surface: Surface, bounds: AxisAlignedBounds, emitter: EventEmitter<E>) {
    super(app, surface, bounds, emitter);
    this.stopped = true;
  }

  async gotoScene(newActivity: Activity<E>, name: string): Promise<void> {
    await super.gotoScene(newActivity, name);
    /**
     * An error `Uncaught TypeError: currentTarget.isInteractive is not a function` occur
     * when a mouse event is fired and this Emitter is running on.
     * Then eventMode needs to be `none`.
    */
    if (this.context) {
      this.context.zIndex = 1000;
      this.context.eventMode = "none";
    }
  }

  public emit(config: EmitterConfigV3): void {
    if (this.stopped || !this.context) return;
    const emitter = new Emitter(this.context, config)
    const update = (dt: number) => emitter.update(dt * 0.01);
    emitter.emit = true;
    emitter.playOnce(() => this.ticker.remove(update, this));
    this.ticker.add(update, this);
  }

  public stop(): void {
    this.stopped = true;
    this.ticker.stop();
  }

  public play(): void {
    this.stopped = false;
    this.ticker.start();
  }
};
