import { Surface, EventEmitter, AxisAlignedBounds } from "core";
import { Manager } from "core/Manager"
import { ActivityConstructor } from "core/typings";
import { Ticker, Container, Rectangle } from "pixi.js";
import { AppEvents } from "typings";

/**
 * Game Background Manager.
 */
export class BgManager extends Manager<AppEvents> {
  suspended: boolean;

  constructor(
    ticker: Ticker,
    stage: Container,
    screen: Rectangle,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<AppEvents>,
    index?: number
  ) {
    super(ticker, stage, screen, surface, bounds, emitter, index);
    this.suspended = false;
  }

  async goto(ctor: ActivityConstructor<AppEvents>): Promise<void> {
    if (!this.suspended) {
      return super.goto(ctor);
    }
    if (this.context) {
      this.stage.addChild(this.context);
      this.stage.sortChildren();
      this.suspended = false;
    }
  }

  suspend() {
    if (this.context) {
      this.context.removeFromParent();
      this.suspended = true;
    }
  }
}
