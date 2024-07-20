import { Ticker } from "pixi.js"
import { AbstractCollision } from "./Collision"
import { CollisionCache } from "./CollisionCache"
import { Manager } from "./Manager"

export class CollisionServer {
  private collisions: AbstractCollision[] = []
  private cache: CollisionCache = new CollisionCache()
  private running: boolean = false

  constructor(
    private readonly manager: Manager,
  ) {
    this.manager.emitter.on(
      "addCollision",
      (collision) => {
        this.collisions.push(collision)
      }
    )
    this.manager.emitter.on(
      "removeCollision",
      (collision) => {
        const index = this.collisions.findIndex((col) => col.equal(collision))
        this.collisions.splice(index, 1)
      }
    )
    Ticker.shared.add(this.onUpdate, this)
  }


  private async asyncTest() {
    this.running = true

    const colliding = (
      left: AbstractCollision,
      right: AbstractCollision
    ) => {
      if (
        left &&
        right.overleaps(left.shape)
      ) {
        this.cache.setCache(left, right)
        left.parent.emitter.emit("onCollision", right)
        right.parent.emitter.emit("onCollision", left)
        return true
      }
      return false
    }

    // TODO: bug do shape 0, 0!!!!

    const testBodyEnter = (
      left: AbstractCollision,
      right: AbstractCollision
    ) => {
      if (
        left && right &&
        !this.cache.cacheHit(left, right) && colliding(left, right)
      ) {
        left.parent.emitter.emit("onCollisionEnter", right)
        right.parent.emitter.emit("onCollisionEnter", left)
      }
    }

    const testBodyExit = (
      left: AbstractCollision,
      right: AbstractCollision
    ) => {
      if (
        left && right &&
        this.cache.cacheHit(left, right) && !colliding(left, right)
      ) {
        left.parent.emitter.emit("onCollisionExit", right)
        right.parent.emitter.emit("onCollisionExit", left)
        this.cache.removeCache(left, right)
      }
    }

    this.collisions.forEach((left, index, collisions) => {
      const right = collisions[index + 1]
      left && right && testBodyEnter(left, right)
      left && right && testBodyExit(left, right)
      left && right && colliding(left, right)
      left && right && colliding(right, left)
    })

    this.running = false
  }

  onUpdate() {
    if (!this.running)
      this.asyncTest()
  }
}
