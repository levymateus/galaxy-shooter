import { Activity, Context } from "core"
import { GUIManager } from "managers/GUIManager"
import { AppEvents } from "typings"

export default class GameOverScene implements Activity<AppEvents> {
  async onStart(ctx: Context<AppEvents>) {
    const factory = ctx.getManager<GUIManager>().textFactory
    const text = await factory.createTextLg("Game Over")
    text.style.align = "center"
    text.anchor.set(0.5)
    ctx.addChild(text)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }
}
