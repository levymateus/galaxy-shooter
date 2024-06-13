import {
  // Core,
  Activity,
  Context,
  Manager
} from "core"

/**
 * Game Stage Scenes Manager.
 */
export class SceneManager extends Manager { }

export class Scene implements Activity {
  context: Context
  // private _area: Core.AxisAlignedBounds

  async onStart(ctx: Context) {
    this.context = ctx
    // this.area = ctx.bounds.clone().pad(32, 32) as Core.AxisAlignedBounds
    this.context.emitter.on("appPause", isPause =>
      isPause ? this.context.removeUpdates() : this.context.addUpdates()
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate(_delta: number): void {
    // code ...
  }

  async onFinish(): Promise<void> {
    this.context.removeAllListeners()
  }
}
