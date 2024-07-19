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
    Ticker.shared.add(this.onUpdate, this)
  }


  private async asyncTest() {
    this.running = true

    const collides = (left: AbstractCollision, right: AbstractCollision) => {
      if (
        left &&
        right.overleaps(left.shape)
      ) {
        this.cache.setCache(left, right)
        left.parent.emitter.emit("onCollision", right)
        return true
      }
      return false
    }

    this.collisions.forEach((left, index, collisions) => {
      const right = collisions[index + 1]

      if (
        left && right &&
        !this.cache.cacheHit(left, right) && collides(left, right)
      ) {
        left.parent.emitter.emit("onCollisionEnter", right)
      }

      if (
        left && right &&
        this.cache.cacheHit(left, right) && !collides(left, right)
      ) {
        left.parent.emitter.emit("onCollisionExit", right)
        this.cache.removeCache(left, right)
      }

      left && right && collides(left, right)
      left && right && collides(right, left)
    })

    this.running = false
  }

  onUpdate() {
    if (!this.running)
      this.asyncTest()
  }
}
