import { Context, Timer } from "core";
import { Assets, AssetsManifest } from "pixi.js";
import { SpaceShooterEvents } from "typings";
import { Text } from "ui";
import { Scene } from "../managers/SceneManager";

export default class LoadingScene extends Scene {
  static SCENE_NAME = "loading_scene";
  static SCENE_TIMEOUT = 1000;

  bundleIds?: string[];
  next?: (() => void);
  manifest?: string | AssetsManifest;

  async onStart(context: Context<SpaceShooterEvents>) {
    this.context = context;

    const text = new Text("Loading...");
    text.style.align = "center";
    text.anchor.set(0.5);
    text.weight("bold");
    this.context.addChild(text);

    await Assets.init({ manifest: this.manifest || "" });
    await Assets.loadBundle(this.bundleIds || []);
    if (this.next) new Timer().timeout(this.next, LoadingScene.SCENE_TIMEOUT);
  }

  onUpdate(_: number): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
