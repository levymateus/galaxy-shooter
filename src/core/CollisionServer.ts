import { Ticker } from "pixi.js";
import { Manager } from "./Manager";
import { Collision } from "./Collision";

export class CollisionServer {
  private collisions: Collision[] = []
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

    this.collisions.forEach((left, index, collisions) => {
      const right = collisions[index + 1]

      if (
        right &&
        left.test(right.shape)
      ) {
        left.parent.emitter.emit("onCollision", right)
      }

      if (
        right &&
        right.test(left.shape)
      ) {
        right.parent.emitter.emit("onCollision", left)
      }
    })

    this.running = false
  }

  onUpdate() {
    if (!this.running)
      this.asyncTest()
  }
}
