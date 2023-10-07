import { AxisAlignedBounds, EventEmitter, Surface } from "core";
import { Application, Ticker, utils } from 'pixi.js';
import GUI from "ui/GUI";
import { Activity } from "ui/typings";

export class GUIManager<E extends utils.EventEmitter.ValidEventTypes> {
  public app: Application;
  public surface: Surface;
  public emitter: EventEmitter<E>;
  public bounds: AxisAlignedBounds;
  private activity: Activity<E> | null;
  private ticker: Ticker;

  constructor(
    app: Application,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<E>
  ) {
    this.app = app;
    this.surface = surface;
    this.bounds = bounds;
    this.activity = null;
    this.emitter = emitter;
    this.ticker = Ticker.shared;
    this.app.ticker.add(this.update, this);
  }

  async render(newActivity: Activity<E>, name: string) {
    await this.destroy();

    const width = this.surface.width;
    const height = this.surface.height;
    const actualWidth = this.surface.actualWidth() / width;
    const actualHeight = this.surface.actualHeight() / height;
    const guiX = this.app.screen.width / 2 - this.surface.actualWidth() / 2;
    const guiY = this.app.screen.height / 2 - this.surface.actualHeight() / 2;

    const gui = new GUI<E>(name);
    gui.name = name;
    gui.emitter = this.emitter;
    gui.bounds = this.bounds;
    gui.zIndex = 1000;
    gui.width = width;
    gui.height = height;
    gui.scale.x = actualWidth;
    gui.scale.y = actualHeight;
    gui.x = guiX;
    gui.y = guiY;

    await newActivity.onStart(gui);
    this.app.stage.addChild(gui);
    this.ticker.start();
    this.app.ticker.start();
    this.app.stage.sortChildren();
    this.activity = newActivity;
    this.activity.name = name;
  }

  private async unmountActivity(activity: Activity<E>): Promise<void> {
    await activity?.onFinish();
    const child = this.app.stage.getChildByName(activity.name);
    if (child) this.app.stage.removeChild(child);
    else console.warn(activity.name, "was not found.");
  }

  private update(delta: number) {
    if (this.activity !== null) this.activity.onUpdate(delta);
  }

  public async destroy() {
    if (this.activity !== null) {
      await this.unmountActivity(this.activity);
      this.activity = null;
    }
  }
}
