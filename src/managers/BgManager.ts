import { Surface, EventEmitter, AxisAlignedBounds } from "core";
import { Manager } from "core/Manager"
import { Activity } from "core/typings";
import { Ticker, Container, Rectangle } from "pixi.js";
import { SpaceShooterEvents } from "typings";

/**
 * Game Background Manager.
 */
export class BgManager extends Manager<SpaceShooterEvents> {
  suspended: boolean;

  constructor(
    ticker: Ticker,
    stage: Container,
    screen: Rectangle,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<SpaceShooterEvents>
  ) {
    super(ticker, stage, screen, surface, bounds, emitter);
    this.suspended = false;
  }

  async gotoScene(newActivity: Activity<SpaceShooterEvents>, name: string): Promise<void> {
    if (!this.suspended) {
      return super.gotoScene(newActivity, name);
    }
    if (this.context) {
      this.context.visible = true;
    }
  }

  suspend() {
    if (this.context) {
      this.context.visible = false;
      this.suspended = true;
    }
  }
}
