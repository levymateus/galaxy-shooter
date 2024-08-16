import { EventNamesEnum } from "app/enums"
import { Context } from "core"
import { Assets, AssetsManifest } from "pixi.js"
import manifest from "res/manifest.json"
import { TextFactory } from "ui/Text"
import { Scene } from "../managers/SceneManager"

export default class LoadingScene extends Scene {
  bundleIds?: string[]
  manifest?: string | AssetsManifest

  async onStart(ctx: Context) {
    this.context = ctx
    this.context.anchor.set(-0.5)
    this.context.visible = true
    this.bundleIds = [
      "enviroments_bundle",
      "mainship_bundle",
      "vfx_bundle",
      "klaed_fighter_bundle",
      "pickups_bundle",
      "klaed_scout",
      "klaed_support",
      "klaed_bomber",
      "klaed_torpedo",
      "klaed_battlecruiser_bundle",
    ]
    this.manifest = manifest

    await Assets.init({ manifest: this.manifest || "" })
    await Assets.loadBundle(this.bundleIds || [])

    const factory = new TextFactory()
    const text = await factory.createTextLg("Loading...")
    text.style.align = "center"
    text.anchor.set(0.5)
    this.context.addChild(text)

    await this.gotoMainMenu()
  }

  async gotoMainMenu() {
    this.context.emitter.emit(EventNamesEnum.MAIN_MENU)

    // the visible false solve the
    // persistent loading scene after first main menu
    this.context.visible = false
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }

  destroy(): void { }
}
