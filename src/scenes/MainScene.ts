import { Context } from "core"
import { Scene } from "managers/SceneManager"

export default class MainScene extends Scene {
  async onStart(ctx: Context): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)
  }
}
