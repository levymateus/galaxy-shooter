import { Activity, Context } from "core"
import { AppEvents } from "typings"
import { Text } from "ui"

export default class GameOverScene implements Activity<AppEvents> {
  async onStart(ctx: Context<AppEvents>) {
    const text = new Text("Game Over!")
    text.style.align = "center"
    text.anchor.set(0.5)
    ctx.addChild(text)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }
}
