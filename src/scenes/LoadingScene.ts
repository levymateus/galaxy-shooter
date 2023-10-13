import { Context, Timer } from "core";
import { Assets, AssetsManifest } from "pixi.js";
import { Activity } from "core/SceneManager";
import { SpaceShooterEvents } from "typings";
import { Text } from "ui";

export default class LoadingScene extends Activity<SpaceShooterEvents> {
  public static SCENE_NAME = "loading_scene";
  public static SCENE_TIMEOUT = 1000;

  public bundleIds?: string[];
  public next?: (() => void);
  public manifest?: string | AssetsManifest;

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
  public destroy(): void { }
}
