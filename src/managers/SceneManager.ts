import { Activity, AxisAlignedBounds, CollisionTest, Context, GameObject, Manager } from "core"
import { DisplayObject } from "pixi.js"
import { AppEvents } from "typings"

/**
 * Game Stage Scenes Manager.
 */
export class SceneManager extends Manager<AppEvents> { }

export class Scene implements Activity<AppEvents> {
  context: Context<AppEvents>
  private area: AxisAlignedBounds
  private collision: CollisionTest<AppEvents, GameObject<AppEvents>>

  async onStart(ctx: Context<AppEvents>) {
    this.context = ctx
    this.area = ctx.bounds.clone().pad(32, 32) as AxisAlignedBounds
    this.collision = new CollisionTest()
    this.context.on("childAdded", child =>
      child instanceof GameObject && this.collision.add(child)
    )
    this.context.on("childRemoved", child =>
      child instanceof GameObject && this.collision.remove(child)
    )
    this.context.emitter.on("appPause", isPause =>
      isPause ? this.context.removeUpdates() : this.context.addUpdates()
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate(_delta: number): void {
    this.context.children.forEach(child => {
      this.contains(child)
      this.testCollision(child)
    })
  }

  async onFinish(): Promise<void> {
    this.context.removeAllListeners()
  }

  private contains(child: DisplayObject) {
    if (child instanceof GameObject) {
      const vertex = [{ x: child.x, y: child.y }]
      const notContains = vertex.every(({ x, y }) => !this.area.contains(x, y))
      if (notContains) {
        child.emitter.emit("outOfBounds")
        this.collision.remove(child)
      }
    }
  }

  private async testCollision(child: DisplayObject) {
    if (child instanceof GameObject) {
      this.collision.from(child).forEach(other => {
        other.emitter.emit("onCollide", child)
        child.emitter.emit("onCollide", other)
      })
    }
  }
}
