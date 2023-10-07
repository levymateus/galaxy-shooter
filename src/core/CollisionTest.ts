
import { GameObject } from "core";
import { Circle } from "pixi.js";

type Collision<A, B> = [A, B];

export default class CollisionTest<T extends GameObject = GameObject> {
  private candidatesSet: Set<T>;
  private collisionMap: Map<string, string>;

  constructor() {
    this.candidatesSet = new Set();
    this.collisionMap = new Map();
  }

  private test(objA: T, objB: T): boolean {
    if (!objA.collisionTest || !objB.collisionTest) return false;
    if (objA.collisionShape instanceof Circle && objB.collisionShape instanceof Circle) {
      const dist = Math.sqrt(Math.pow(objA.x - objB.x, 2) + Math.pow(objA.y - objB.y, 2))
      return (dist <= objA.collisionShape.radius + objB.collisionShape.radius);
    }
    return false;
  }

  collisions(): Collision<T, T>[] {
    const cols: Collision<T, T>[] = [];
    for (const objA of this.candidatesSet) {
      for (const objB of this.candidatesSet) {

        const collides = this.collisionMap.get(objA.id) === objB.id
          || this.collisionMap.get(objB.id) === objA.id;

        if (!collides && objA.id !== objB.id && this.test(objA, objB)) {
          // on enter / on starts collide
          this.collisionMap.set(objA.id, objB.id); this.collisionMap.set(objB.id, objA.id);
          cols.push([objA, objB]); cols.push([objB, objA]);
          continue;
        }
        if (collides && !this.test(objA, objB)) {
          // on exit / on stop collide
          let collision = this.collisionMap.get(objA.id);
          if (collision === objB.id) {
            this.collisionMap.delete(objA.id);
          }

          collision = this.collisionMap.get(objB.id);
          if (collision === objA.id) {
            this.collisionMap.delete(objB.id);
          }
        }
      }
    }
    return cols;
  }

  add(candidate: T): void {
    this.candidatesSet.add(candidate);
  }

  remove(candidate: T): void {
    this.candidatesSet.delete(candidate);
  }
}
