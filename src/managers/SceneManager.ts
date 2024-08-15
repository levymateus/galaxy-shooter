import {
  Activity,
  Context,
  Core,
  Manager
} from "core"
import { UPDATE_PRIORITY } from "pixi.js"

/**
 * Game Stage Scenes Manager.
 */
export class SceneManager extends Manager {
  suspended = false

  suspend() {
    if (this.context) {
      this.context.removeFromParent()
      this.suspended = true
    }
  }
}

export class Scene implements Activity {
  context: Context
  boundingArea: Core.AxisAlignedBounds

  async onStart(ctx: Context) {
    this.context = ctx

    this.boundingArea = ctx.bounds.clone().pad(32, 32) as Core.AxisAlignedBounds
    this.context.getManager()
      .ticker.add(this.boundsUpdate, this, UPDATE_PRIORITY.UTILITY)

    this.context.emitter.on("appPause", isPause =>
      isPause ? this.context.removeUpdates() : this.context.addUpdates()
    )
  }

  private boundsUpdate() {
    this.context.children.forEach((child) => {
      if (!this.boundingArea.contains(child.position.x, child.position.y)) {
        child.destroy({ children: true })
      }
    })
  }

  onUpdate(_: number): void {
    throw new Error("Method not implemented.")
  }

  async onFinish(): Promise<void> {
    this.context.removeAllListeners()
  }
}
