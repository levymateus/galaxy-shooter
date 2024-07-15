import { Circle, Graphics, Ticker, UPDATE_PRIORITY } from "pixi.js";
import { GameObject } from "./GameObject";
import type { Collideable, Unique } from "./typings";
import { Id } from "decorators";

export class Collision implements Collideable, Unique {
  @Id() id = '';

  private static DEFAULT_COLLISION_SHAPE_NAME = "CollisionShapeCircle"

  constructor(
    public readonly parent: GameObject,
    public readonly shape: Circle,
  ) {
    const manager = this.parent.context.getManager()
    manager.emitter.emit("addCollision", this)

    Ticker.shared.add(() => {
      this.shape.x = this.parent.x
      this.shape.y = this.parent.y
      this.drawShape()
    }, this.parent, UPDATE_PRIORITY.LOW)

    const gr = new Graphics()
    gr.name = Collision.DEFAULT_COLLISION_SHAPE_NAME
    this.parent.addChildAt(gr, 0)
  }

  private drawShape() {
    const graphic = this.parent.getChildByName<Graphics>(
      Collision.DEFAULT_COLLISION_SHAPE_NAME,
    )
    graphic?.clear()
    graphic?.beginFill(0xffffff)
    graphic?.drawCircle(0, 0, this.shape.radius)
    graphic?.endFill()
  }

  test(shape: Circle) {
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
