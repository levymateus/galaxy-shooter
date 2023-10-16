import { Context, Timer } from "core";
import { Assets, AssetsManifest } from "pixi.js";
import { AppEvents } from "typings";
import { Text } from "ui";
import { Scene } from "../managers/SceneManager";
import manifest from "res/manifest.json";
import { gotoMainScene } from "index";

export default class LoadingScene extends Scene {
  bundleIds?: string[];
  next?: (() => void);
  manifest?: string | AssetsManifest;

  async onStart(context: Context<AppEvents>) {
    this.context = context;
    this.bundleIds = [
      "enviroments_bundle",
      "mainship_bundle",
      "vfx_bundle",
      "klaed_fighter_bundle"
    ];
    this.manifest = manifest;
    this.next = gotoMainScene;

    const text = new Text("Loading...");
    text.style.align = "center";
    text.anchor.set(0.5);
    text.weight("bold");
    this.context.addChild(text);

    await Assets.init({ manifest: this.manifest || "" });
    await Assets.loadBundle(this.bundleIds || []);
    if (this.next) new Timer().timeout(this.next, 1000);
  }

  onUpdate(): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
