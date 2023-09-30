import { GameOptions, ISceneGraph, Resolution, Settings } from "core";
import { Application, Assets, Ticker, settings } from 'pixi.js';
import { Wrapper } from 'core/Wrapper';
import devtools from 'config';

export class Game {

  public app: Application;

  private currentScene: ISceneGraph;
  private surface: Resolution;

  constructor(window: Window, body: HTMLElement, options?: GameOptions) {
    if (options?.manifest) {
      Assets.init({ manifest: options.manifest });
    }

    settings.RESOLUTION = window.devicePixelRatio || 1;
    this.surface = Settings.resolutions[2];

    this.app = new Application({
      resizeTo: window,
      autoDensity: false,
      antialias: false,
      backgroundColor: 0x1f1f24,
      autoStart: false,
    });

    this.app.stage.name = "stage";
    Ticker.shared.autoStart = false;

    window.addEventListener('resize', () => {
      const aux = this.currentScene;
      this.currentScene.onFinish();
      this.app.resize();
      this.gotoScene(aux);
    });

    // @ts-ignore
    devtools(this.app);

    // @ts-ignore
    body.appendChild(this.app.view);

    this.app.ticker.add((delta) => {
      this.update(delta)
    });
  }

  async gotoScene(newScene: ISceneGraph) {
    if (this.currentScene !== undefined) {
      Ticker.shared.stop();
      this.app.ticker.stop();
      await this.currentScene.onFinish();
      this.app.stage.removeChildren();
    }

    const wrapper = new Wrapper(this.WIDTH, this.HEIGHT);
    wrapper.width = this.WIDTH;
    wrapper.height = this.HEIGHT;
    wrapper.scale.x = this.actualWidth() / this.WIDTH;
    wrapper.scale.y = this.actualHeight() / this.HEIGHT;
    wrapper.x = this.app.screen.width / 2 - this.actualWidth() / 2;
    wrapper.y = this.app.screen.height / 2 - this.actualHeight() / 2;

    await newScene.onStart(wrapper);
    this.app.stage.addChild(wrapper);
    this.currentScene = newScene;

    Ticker.shared.start();
    this.app.ticker.start();
  }

  update(delta: number) {
    if (this.currentScene !== undefined) {
      this.currentScene.onUpdate(delta);
    }
  }

  get WIDTH() {
    return this.surface.w;
  }

  get HEIGHT() {
    return this.surface.h;
  }

  // The dynamic width and height lets us do some smart
  // scaling of the main game content; here we're just
  // using it to maintain a 14:10 aspect ratio and giving
  // our scenes a 640x360 stage to work with

  actualWidth() {
    const [w, h] = this.surface.ratio;
    const aspectRatio = w / h;
    const { width, height } = this.app.screen;
    const isWidthConstrained = width < height * aspectRatio;
    return isWidthConstrained ? width : height * aspectRatio;
  }

  actualHeight() {
    const [w, h] = this.surface.ratio;
    const aspectRatio = h / w;
    const { width, height } = this.app.screen;
    const isHeightConstrained = width * aspectRatio > height;
    return isHeightConstrained ? height : width * aspectRatio;
  }
}
