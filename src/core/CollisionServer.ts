import { Ticker } from "pixi.js"
import { AbstractCollision } from "./Collision"
import { CollisionCache } from "./CollisionCache"
import { Manager } from "./Manager"
import { CollisionEventsEnum } from "./enums"

export class CollisionServer {
  private collisions: AbstractCollision[] = []
  private cache: CollisionCache = new CollisionCache()

  constructor(
    private readonly manager: Manager,
  ) {
    this.manager.emitter.on(
      CollisionEventsEnum.ON_COLLISION_ADD,
      this.add,
      this
    )

    this.manager.emitter.on(
      CollisionEventsEnum.ON_COLLISION_REMOVE,
      this.remove,
      this,
    )

    Ticker.shared.add(this.onUpdate, this)
  }

  private add(collision: AbstractCollision) {
    this.collisions.push(collision)
    this.clean()
  }

  private clean() {
    this.collisions.forEach((c) => !c.enabled && this.remove(c))
  }

  private remove(collision: AbstractCollision) {
    const index = this.collisions.findIndex((col) => col.id === collision.id)
    this.collisions.splice(index, 1)
  }

  private colliding(
    left: AbstractCollision,
    right: AbstractCollision
  ) {
    if (left.overleaps(right.shape) && right.overleaps(left.shape)) {
      left.parent.emitter.emit(CollisionEventsEnum.ON_COLLISION, right)
      right.parent.emitter.emit(CollisionEventsEnum.ON_COLLISION, left)
      return true
    }
    return false
  }

  private testBodyEnter(
    left: AbstractCollision,
    right: AbstractCollision
  ) {
    if (!this.cache.cacheHit(left, right) && this.colliding(left, right)) {
      left.parent.emitter.emit(CollisionEventsEnum.ON_COLLISION_ENTER, right)
      right.parent.emitter.emit(CollisionEventsEnum.ON_COLLISION_ENTER, left)
      this.cache.setCache(left, right)
      return true
    }
    return false
  }

  private testBodyExit(
    left: AbstractCollision,
    right: AbstractCollision
  ) {
    if (this.cache.cacheHit(left, right) && !this.colliding(left, right)) {
      left.parent.emitter.emit(CollisionEventsEnum.ON_COLLISION_EXIT, right)
      right.parent.emitter.emit(CollisionEventsEnum.ON_COLLISION_EXIT, left)
      this.cache.removeCache(left, right)
      return true
    }
    return false
  }

  onUpdate() {
    const array = [...this.collisions]
    for (let i = 0; i <= array.length; i += 1) {
      for (let j = 0; j <= array.length; j += 1) {
        const left = array[i]
        const right = array[j]
        if (left && right && !left.equal(right)) {
          const isEnter = this.testBodyEnter(left, right)
          !isEnter && this.testBodyExit(left, right)
        }
      }
    }
  }
}
