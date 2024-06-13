import { Context } from "core"
import { Scene } from "../managers/SceneManager"

export default class VFX extends Scene {
  async onStart(context: Context) {
    this.context = context
  }
  onUpdate(): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
