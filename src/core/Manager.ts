import { Application, Graphics, Ticker, utils } from "pixi.js";
import { Surface, EventEmitter, AxisAlignedBounds, Context } from "core";
import { Activity } from "core/typings";

/**
 * Manager base class implementation.
 */
export class Manager<E extends utils.EventEmitter.ValidEventTypes> {
  public ticker: Ticker;
  public app: Application;
  public surface: Surface;
  public emitter: EventEmitter<E>;
  public bounds: AxisAlignedBounds;
  public activity: Activity<E> | null;
  protected context: Context<E> | null;

  constructor(
    app: Application,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<E>
  ) {
    this.app = app;
    this.surface = surface;
    this.bounds = bounds;
    this.context = null;
    this.activity = null;
    this.emitter = emitter;
    this.ticker = Ticker.shared;
  }

  private update(delta: number) {
    if (this.activity) this.activity.onUpdate(delta);
  }

  async gotoScene(newActivity: Activity<E>, name: string) {
    this.app.ticker.stop();

    const start = Date.now();
    await this.destroy();

    const width = this.surface.width;
    const height = this.surface.height;
    const actualWidth = this.surface.actualWidth() / width;
    const actualHeight = this.surface.actualHeight() / height;
    const contextX = this.app.screen.width / 2 - this.surface.actualWidth() / 2;
    const contextY = this.app.screen.height / 2 - this.surface.actualHeight() / 2;

    this.context = new Context<E>();
    this.context.manager = this;
    this.context.bounds = this.bounds;
    this.context.surface = this.surface;
    this.context.emitter = this.emitter;
    this.context.name = name;
    this.context.width = width;
    this.context.height = height;
    this.context.scale.x = actualWidth;
    this.context.scale.y = actualHeight;
    this.context.x = contextX;
    this.context.y = contextY;

    this.context.pivot.x -= this.surface.width * 0.5;
    this.context.pivot.y -= this.surface.height * 0.5;

    const mask = new Graphics();
    mask.name = `${name}_mask`;
    mask.beginFill();
    mask.drawRect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    );
    mask.endFill();
    this.context.mask = mask;
    this.context.addChild(mask);

    await newActivity.onStart(this.context);
    this.activity = newActivity;

    this.ticker.add(this.update, this);
    this.ticker.start();

    this.app.stage.addChild(this.context);
    this.app.stage.sortChildren();
    this.app.ticker.start();

    console.log((Date.now() - start) / 1000, "finish load", name);
    console.log('Ticker.shared.count', Ticker.shared.count, name);
  }

  public async destroy() {
    if (this.activity && this.context) {
      await this.activity.onFinish();
      this.activity = null;

      this.ticker.stop();
      this.ticker.remove(this.update, this);

      this.context.destroy({ children: true, texture: false, baseTexture: false });
      this.context = null;
    }
  }
}
