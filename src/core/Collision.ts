import { AbstractGameObject } from "core";
import { Circle, Graphics, Ticker, UPDATE_PRIORITY } from "pixi.js";

import { Id } from "decorators";

import type { Collideable, Debuggable, Unique } from "./typings";

/**
 * `AbstractCollision` is a `Collideable` `Unique` object that can be `Debuggable`.
 */
export class AbstractCollision implements Collideable, Unique, Debuggable {
  @Id() id = '';

  private static DEFAULT_COLLISION_SHAPE_NAME = "CollisionShapeCircle"

  constructor(
    public readonly parent: AbstractGameObject,
    public readonly shape: Circle,
  ) {
    const manager = this.parent.context.getManager()
    manager.emitter.emit("addCollision", this)

    if (process.env.debug) this.debug()
  }

  private drawShape(alpha?: number) {
    const graphic = this.parent.getChildByName<Graphics>(
      AbstractCollision.DEFAULT_COLLISION_SHAPE_NAME,
    )
    graphic?.clear()
    graphic?.beginFill(0xffffff, alpha)
    graphic?.drawCircle(0, 0, this.shape.radius)
    graphic?.endFill()
  }

  debug() {
    Ticker.shared.add(() => {
      this.shape.x = this.parent.x
      this.shape.y = this.parent.y
      this.drawShape(0.4)
    }, this.parent, UPDATE_PRIORITY.LOW)

    const gr = new Graphics()
    gr.name = AbstractCollision.DEFAULT_COLLISION_SHAPE_NAME
    this.parent.addChildAt(gr, 0)
  }

  overleaps(shape: Circle) {
    const dx = this.shape.x - shape.x
    const dy = this.shape.y - shape.y

    const distance = Math.sqrt(dx * dx + dy * dy)
    const colliding = distance < this.shape.radius + shape.radius

    return colliding
  }

  equal(u: Unique) {
    return u.id === this.id;
  }
}
