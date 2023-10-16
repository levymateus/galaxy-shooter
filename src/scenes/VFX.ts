import { Context } from "core"
import { AppEvents } from "typings"
import { Scene } from "../managers/SceneManager"

export default class VFX extends Scene {
  async onStart(context: Context<AppEvents>) {
    this.context = context
  }
  onUpdate(): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
