import { Context } from "core"
import { TextFactory } from "ui/Text"
import { Scene } from "../managers/SceneManager"

export default class LoadingScene extends Scene {
  async onStart(ctx: Context) {
    this.context = ctx
    this.context.anchor.set(-0.5)
    this.context.visible = true

    const factory = new TextFactory()
    const text = await factory.createTextLg("Loading...")

    text.style.align = "center"
    text.anchor.set(0.5)
    this.context.addChild(text)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }

  destroy(): void { }
}
