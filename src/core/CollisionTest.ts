
import { GameObject } from "core"
import { Circle, utils } from "pixi.js"

/**
 * The `CollisionTest` implements a simple collision test algorithm.
 */
export class CollisionTest<E extends utils.EventEmitter.ValidEventTypes, T extends GameObject<E>> {
  private set: Set<T>
  private map: Map<string, string>

  constructor() {
    this.set = new Set()
    this.map = new Map()
  }

  private test(left: T, right: T): boolean {
    if (!left.collisionTest || !right.collisionTest) return false
    if (left.collisionShape instanceof Circle && right.collisionShape instanceof Circle) {
      const dist = Math.sqrt(Math.pow(left.x - right.x, 2) + Math.pow(left.y - right.y, 2))
      return (dist <= left.collisionShape.radius + right.collisionShape.radius)
    }
    return false
  }

  /**
   * Test a collision beetwen the `object` argument and the previous added objects.
   * @param object The object to test with
   * @returns A list of collisions
   */
  from(object: T): T[] {
    const cols: T[] = []
    for (const otherObject of this.set) {
      const collides = this.map.get(object.id) === otherObject.id
        || this.map.get(otherObject.id) === object.id

      if (!collides && object.id !== otherObject.id && this.test(object, otherObject)) {
        // on enter / on starts collide
        this.map.set(object.id, otherObject.id)
        this.map.set(otherObject.id, object.id)
        cols.push(otherObject)
        // cols.push([right, left]);
        continue
      }
      if (collides && !this.test(object, otherObject)) {
        // on exit / on stop collide
        let collision = this.map.get(object.id)
        if (collision === otherObject.id) {
          this.map.delete(object.id)
        }

        collision = this.map.get(otherObject.id)
        if (collision === object.id) {
          this.map.delete(otherObject.id)
        }
      }
    }
    return cols
  }

  add(candidate: T): void {
    this.set.add(candidate)
  }

  remove(candidate: T): void {
    this.set.delete(candidate)
  }
}
