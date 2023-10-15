
import { Circle, utils } from "pixi.js";
import { GameObject } from "core/GameObject";

export class CollisionTest<E extends utils.EventEmitter.ValidEventTypes, T extends GameObject<E>> {
  private set: Set<T>;
  private map: Map<string, string>;

  constructor() {
    this.set = new Set();
    this.map = new Map();
  }

  private test(left: T, right: T): boolean {
    if (!left.collisionTest || !right.collisionTest) return false;
    if (left.collisionShape instanceof Circle && right.collisionShape instanceof Circle) {
      const dist = Math.sqrt(Math.pow(left.x - right.x, 2) + Math.pow(left.y - right.y, 2))
      return (dist <= left.collisionShape.radius + right.collisionShape.radius);
    }
    return false;
  }

  from(left: T): T[] {
    const cols: T[] = [];
    for (const right of this.set) {
      const collides = this.map.get(left.id) === right.id
        || this.map.get(right.id) === left.id;

      if (!collides && left.id !== right.id && this.test(left, right)) {
        // on enter / on starts collide
        this.map.set(left.id, right.id);
        this.map.set(right.id, left.id);
        cols.push(right);
        // cols.push([right, left]);
        continue;
      }
      if (collides && !this.test(left, right)) {
        // on exit / on stop collide
        let collision = this.map.get(left.id);
        if (collision === right.id) {
          this.map.delete(left.id);
        }

        collision = this.map.get(right.id);
        if (collision === left.id) {
          this.map.delete(right.id);
        }
      }
    }
    return cols;
  }

  add(candidate: T): void {
    this.set.add(candidate);
  }

  remove(candidate: T): void {
    this.set.delete(candidate);
  }
}
