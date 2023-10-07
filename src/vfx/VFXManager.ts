import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { AxisAlignedBounds, EventEmitter, Surface } from "core";
import { Application, Container, Ticker, utils } from "pixi.js";
import { centralize } from "utils/utils";

export default class VFXManager<E extends utils.EventEmitter.ValidEventTypes> {
  private static VFX_MANAGER_NAME = "VFX_WRAPPER";
  public app: Application;
  public surface: Surface;

  /**
   * `stopped` pause the particle emitter when `true`.
   * the default values is `true`.
   */
  public stopped: boolean;
  public emitter: EventEmitter<E>;
  public bounds: AxisAlignedBounds;
  private wrapper: Container;
  private ticker: Ticker;

  constructor(app: Application, surface: Surface, bounds: AxisAlignedBounds, emitter: EventEmitter<E>) {
    this.app = app;
    this.surface = surface;
    this.bounds = bounds;
    this.stopped = true;
    this.emitter = emitter;
    this.ticker = new Ticker();
    this.ticker.autoStart = false;
    this.stopped = false;

    const width = this.surface.width;
    const height = this.surface.height;
    const actualWidth = this.surface.actualWidth() / width;
    const actualHeight = this.surface.actualHeight() / height;
    const wrapperX = this.app.screen.width / 2 - this.surface.actualWidth() / 2;
    const wrapperY = this.app.screen.height / 2 - this.surface.actualHeight() / 2;

    this.wrapper = new Container();
    this.wrapper.name = VFXManager.VFX_MANAGER_NAME;
    this.wrapper.zIndex = 1000;
    this.wrapper.width = width;
    this.wrapper.height = height;
    this.wrapper.scale.x = actualWidth;
    this.wrapper.scale.y = actualHeight;
    this.wrapper.x = wrapperX;
    this.wrapper.y = wrapperY;

    centralize(this.wrapper, surface);

    /**
     * An error `Uncaught TypeError: currentTarget.isInteractive is not a function` occur
     * when a mouse event is fired and this Emitter is running on.
     * Then eventMode needs to be `none`.
    */
    this.wrapper.eventMode = "none";
    this.app.stage.addChild(this.wrapper);
  }

  public emit(config: EmitterConfigV3): void {
    if (this.stopped) return;
    const emitter = new Emitter(this.wrapper, config)
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
