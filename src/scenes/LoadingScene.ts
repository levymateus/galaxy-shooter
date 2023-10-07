import { Scene, Surface, Timer } from "core";
import { Activity } from "core/typings";
import { Assets, AssetsManifest } from "pixi.js";
import { SpaceShooterEvents } from "typings";
import { Text } from "ui";

export default class LoadingScene implements Activity<SpaceShooterEvents> {
  public static SCENE_NAME = "loading_scene";
  public static SCENE_TIMEOUT = 1000;
  public name: string;
  public surface: Surface;
  public bundleIds: string[];
  public next: (() => void);
  public manifest: string | AssetsManifest;
  private scene: Scene<SpaceShooterEvents>;

  constructor(surface: Surface, bundleIds: string[], manifest: string | AssetsManifest, next: (() => void)) {
    this.surface = surface;
    this.bundleIds = bundleIds;
    this.manifest = manifest;
    this.next = next;
  }

  private addLoadingMessage() {
    const text = new Text("loading...");
    text.style.align = "center";
    text.anchor.set(0.5);
    text.weight("bold");
    this.scene.addChild(text);
  }

  async onStart(scene: Scene<SpaceShooterEvents>) {
    this.scene = scene;
    this.scene.name = LoadingScene.SCENE_NAME;
    this.name = LoadingScene.SCENE_NAME;
    this.addLoadingMessage();
    await Assets.init({ manifest: this.manifest });
    await Assets.loadBundle(this.bundleIds);
    new Timer().timeout(this.next, LoadingScene.SCENE_TIMEOUT);
  }

  onUpdate(_: number): void { }

  async onFinish(): Promise<void> { }
}
