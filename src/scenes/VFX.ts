import { Context } from "core"
import { Scene } from "../managers/SceneManager"

export default class VFX extends Scene {
  async onStart(ctx: Context) {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)
  }
  onUpdate(): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
