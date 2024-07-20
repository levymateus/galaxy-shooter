import { AbstractGameObject } from "core";
import { Circle, Graphics, Ticker, UPDATE_PRIORITY } from "pixi.js";

import { Id } from "decorators";

import type { Collideable, Drawable, Switchable, Unique } from "./typings";

/**
 * `AbstractCollision` is a `Collideable` `Unique` object that can be `Drawable` and `Switchable`.
 */
export class AbstractCollision
  implements Collideable, Unique, Drawable, Switchable {
  @Id() id = '';

  private static DEFAULT_COLLISION_SHAPE_NAME = "CollisionShapeCircle"

  constructor(
    public readonly parent: AbstractGameObject,
    public readonly shape: Circle,
  ) { }

  draw(gr: Graphics) {
    gr.clear()
    gr.beginFill(0xffffff, 0.4)
    gr.drawCircle(0, 0, this.shape.radius)
    gr.endFill()
  }

  overleaps(shape: Circle) {
    const dx = this.shape.x - shape.x
    const dy = this.shape.y - shape.y

    const distance = Math.sqrt(dx * dx + dy * dy)
    const colliding = distance < this.shape.radius + shape.radius

    return colliding
  }

  equal(unique: Unique) {
    return unique.id === this.id;
  }

  /**
   * Adds the collision to the collision server and the container.
   */
  enable() {
    const gr = new Graphics()

    gr.name = AbstractCollision.DEFAULT_COLLISION_SHAPE_NAME

    this.parent.addChildAt(gr, 0)

    const manager = this.parent.context.getManager()
    manager.emitter.emit("addCollision", this)

    Ticker.shared.add(() => {
      this.shape.x = this.parent.x
      this.shape.y = this.parent.y
      if (process.env.debug) this.draw(gr)
    }, this.parent, UPDATE_PRIORITY.LOW)
  }

  /**
   * Removes the collision from the collision server and the container.
   */
  disable(): void {
    const manager = this.parent.context.getManager()
    manager.emitter.emit("removeCollision", this)
    this.parent.getChildByName(AbstractCollision.DEFAULT_COLLISION_SHAPE_NAME)
  }
}
