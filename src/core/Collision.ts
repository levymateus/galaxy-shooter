import { AbstractGameObject } from "core";
import { Circle, Graphics, Ticker, UPDATE_PRIORITY } from "pixi.js";

import { uuid } from "utils/uuid";
import { CollisionEventsEnum } from "./enums";
import type { Collideable, Drawable, Switchable, Unique } from "./typings";

/**
 * `AbstractCollision` is a `Collideable` `Unique` object that can be `Drawable` and `Switchable`.
 */
export class AbstractCollision
  implements Collideable, Unique, Drawable, Switchable {
  id = uuid();
  enabled = false
  private graphics = new Graphics()

  constructor(
    public readonly parent: AbstractGameObject,
    public readonly shape: Circle,
  ) {
    this.graphics.name = AbstractCollision.name
    this.parent.addChildAt(this.graphics, 0)
    Ticker.shared.add(() => {
      this.shape.x = this.parent.x
      this.shape.y = this.parent.y
      if (process.env.debug && this.enabled) this.draw()
    }, this.parent, UPDATE_PRIORITY.LOW)
  }

  draw() {
    this.graphics.clear()
    this.graphics.beginFill(0xffffff, 0.4)
    if (this.shape instanceof Circle) {
      this.graphics.drawCircle(0, 0, this.shape.radius)
    }
    this.graphics.endFill()
  }

  private testCircles(a: Circle, b: Circle) {
    const dx = a.x - b.x
    const dy = a.y - b.y

    const distance = Math.sqrt(dx * dx + dy * dy)
    const colliding = distance < a.radius + b.radius

    return colliding
  }

  overleaps(shape: Circle) {
    if (shape instanceof Circle && this.shape instanceof Circle) {
      return this.testCircles(shape, this.shape)
    }
    return false
  }

  equal(unique: Unique) {
    return unique.id === this.id;
  }

  /**
   * Adds the collision to the collision server and the container.
   */
  enable() {
    this.enabled = true
    const manager = this.parent.context.getManager()
    manager.emitter.emit(CollisionEventsEnum.ON_COLLISION_ADD, this)
  }

  /**
   * Removes the collision from the collision server and the container.
   */
  disable(): void {
    this.enabled = false
  }
}
