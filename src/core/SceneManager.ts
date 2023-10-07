import { AxisAlignedBounds, EventEmitter, Surface } from "core";
import { Scene } from 'core/Scene';
import { Activity } from 'core/typings';
import { Application, Ticker, utils } from 'pixi.js';
import { centralize } from "utils/utils";

export class SceneManager<E extends utils.EventEmitter.ValidEventTypes> {
  public app: Application;
  public surface: Surface;
  public emitter: EventEmitter<E>;
  public bounds: AxisAlignedBounds;
  private activity: Activity<E> | null = null;
  private ticker: Ticker;

  constructor(app: Application, surface: Surface, bounds: AxisAlignedBounds, eventEmitter: EventEmitter<E>) {
    this.app = app;
    this.surface = surface;
    this.bounds = bounds;
    this.emitter = eventEmitter;
    this.ticker = Ticker.shared;
    this.ticker.autoStart = false;
    this.app.ticker.add(this.update, this);
  }

  async gotoScene(newActivity: Activity<E>, name: string) {
    let start = Date.now();

    await this.destroy();

    const width = this.surface.width;
    const height = this.surface.height;
    const actualWidth = this.surface.actualWidth() / width;
    const actualHeight = this.surface.actualHeight() / height;
    const sceneX = this.app.screen.width / 2 - this.surface.actualWidth() / 2;
    const sceneY = this.app.screen.height / 2 - this.surface.actualHeight() / 2;

    const scene = new Scene<E>(this.bounds);
    scene.sceneManager = this;
    scene.emitter = this.emitter;
    scene.zIndex = 0;
    scene.name = name;
    scene.width = width;
    scene.height = height;
    scene.scale.x = actualWidth;
    scene.scale.y = actualHeight;
    scene.x = sceneX;
    scene.y = sceneY;

    centralize(scene, this.surface);

    await newActivity.onStart(scene);
    this.app.stage.addChild(scene);
    this.ticker.start();
    this.app.ticker.start();
    this.app.stage.sortChildren();
    this.activity = newActivity;
    this.activity.name = name;

    console.log((Date.now() - start) / 1000, "finish load", name);
  }

  private async unmountActivity(activity: Activity<E>): Promise<void> {
    this.ticker.stop();
    this.app.ticker.stop();
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
