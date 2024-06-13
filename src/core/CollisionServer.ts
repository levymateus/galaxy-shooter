import { UPDATE_PRIORITY } from "pixi.js";

import { Manager } from "./Manager";
import { Collision } from "./Collision";

export class CollisionServer {
  private collisions: Collision[] = []

  constructor(
    private readonly manager: Manager,
  ) {
    this.manager.emitter.on(
      "addCollision",
      (collision) => this.collisions.push(collision)
    )
    this.manager.ticker.add(this.onUpdate, this, UPDATE_PRIORITY.NORMAL)
  }

  onUpdate() {
    this.collisions.forEach((collision, index, collisions) => {
      const nextShape = collisions[index + 1]?.shape

      if (nextShape && collision.test(nextShape)) {
        collision.parent.emit("onCollision", collisions[index + 1])
      }

      collision.debug()
    })
  }
}
