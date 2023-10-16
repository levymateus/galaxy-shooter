import { AxisAlignedBounds, Context, EventEmitter, Surface } from "core";
import { Activity, ActivityConstructor } from "core/typings";
import { Container, Graphics, Rectangle, Ticker, utils } from "pixi.js";

/**
 * Manager base class implementation.
 */
export class Manager<E extends utils.EventEmitter.ValidEventTypes> {
  ticker: Ticker;
  stage: Container;
  screen: Rectangle;
  surface: Surface;
  emitter: EventEmitter<E>;
  bounds: AxisAlignedBounds;
  activity: Activity<E> | null;
  index?: number;
  protected context: Context<E> | null;

  constructor(
    ticker: Ticker,
    stage: Container,
    screen: Rectangle,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<E>,
    index?: number,
  ) {
    this.stage = stage;
    this.screen = screen;
    this.surface = surface;
    this.bounds = bounds;
    this.context = null;
    this.activity = null;
    this.emitter = emitter;
    this.ticker = ticker;
    this.index = index;
  }

  async goto(ctor: ActivityConstructor<E>) {
    this.ticker.stop();

    await this.destroy();

    this.context = new Context<E>(this.surface, this.screen);
    this.context.name = ctor.name;
    this.context.manager = this;
    this.context.bounds = this.bounds;
    this.context.emitter = this.emitter;
    this.context.anchor.set(0.5);

    const mask = new Graphics();
    mask.name = [this.context.name, 'mask'].join('_');
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

    this.activity = new ctor();
    await this.activity.onStart(this.context);

    if (this.index) this.stage.addChildAt(this.context, this.index);
    else this.stage.addChild(this.context);
    this.stage.sortChildren();

    this.ticker.add(this.activity.onUpdate, this.activity);
    this.ticker.start();

    console.log('Scene %s listeners %d', ctor.name, Ticker.shared.count);
  }

  async destroy() {
    if (this.activity && this.context) {
      this.ticker.stop();
      this.ticker.remove(this.activity.onUpdate, this.activity);

      await this.activity.onFinish();
      this.activity = null;


      this.context.destroy({ children: true, texture: false, baseTexture: false });
      this.context = null;
    }
  }
}
