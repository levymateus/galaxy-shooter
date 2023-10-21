import { Context } from "core"
import { Scene } from "managers/SceneManager"
import { AppEvents } from "typings"

export default class MainScene extends Scene {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)
  }
}
