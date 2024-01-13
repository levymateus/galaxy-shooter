import { Context } from "core"
import { isCatalogSceneEnabled } from "feats"
import { gotoCatalogScene, gotoMainScene } from "index"
import { Assets, AssetsManifest } from "pixi.js"
import manifest from "res/manifest.json"
import { AppEvents } from "typings"
import { TextFactory } from "ui/Text"
import { Scene } from "../managers/SceneManager"

export default class LoadingScene extends Scene {
  bundleIds?: string[]
  manifest?: string | AssetsManifest

  async onStart(ctx: Context<AppEvents>) {
    this.context = ctx
    this.context.anchor.set(-0.5)
    this.bundleIds = [
      "enviroments_bundle",
      "mainship_bundle",
      "vfx_bundle",
      "klaed_fighter_bundle",
      "pickups_bundle",
      "klaed_scout",
      "klaed_support",
      "klaed_bomber"
    ]
    this.manifest = manifest

    await Assets.init({ manifest: this.manifest || "" })
    await Assets.loadBundle(this.bundleIds || [])

    const factory = new TextFactory()
    const text = await factory.createTextLg("Loading...")
    text.style.align = "center"
    text.anchor.set(0.5)
    this.context.addChild(text)

    if (isCatalogSceneEnabled) return await gotoCatalogScene()
    return await gotoMainScene()
  }

  onUpdate(): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
