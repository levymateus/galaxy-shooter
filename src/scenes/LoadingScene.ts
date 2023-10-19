import { Context, Timer } from "core"
import { gotoMainScene } from "index"
import { Assets, AssetsManifest } from "pixi.js"
import manifest from "res/manifest.json"
import { AppEvents } from "typings"
import { TextFactory } from "ui/Text"
import { Scene } from "../managers/SceneManager"

export default class LoadingScene extends Scene {
  bundleIds?: string[]
  next?: (() => void)
  manifest?: string | AssetsManifest

  async onStart(ctx: Context<AppEvents>) {
    this.context = ctx
    this.bundleIds = [
      "enviroments_bundle",
      "mainship_bundle",
      "vfx_bundle",
      "klaed_fighter_bundle"
    ]
    this.manifest = manifest
    this.next = gotoMainScene

    await Assets.init({ manifest: this.manifest || "" })
    await Assets.loadBundle(this.bundleIds || [])

    const factory = new TextFactory()
    const text = await factory.createTextLg("Loading...")
    text.style.align = "center"
    text.anchor.set(0.5)
    this.context.addChild(text)

    if (this.next) new Timer().timeout(this.next, 1000)
  }

  onUpdate(): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
