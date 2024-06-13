import { Circle, Graphics } from "pixi.js";
import { GameObject } from "./GameObject";

export class Collision implements Collision {
  private static DEFAULT_COLLISION_SHAPE_NAME = "CollisionShapeCircle"
  
  constructor(
    public readonly parent: GameObject,
    public readonly shape: Circle,
  ) {
    const manager = this.parent.context.getManager()
    manager.emitter.emit("addCollision", this)
    const gr = new Graphics()
    gr.name = Collision.DEFAULT_COLLISION_SHAPE_NAME
    this.parent.addChildAt(gr, 0)
  }

  private drawShape() {
    const graphic = this.parent.getChildByName<Graphics>(
      Collision.DEFAULT_COLLISION_SHAPE_NAME
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

  debug() {
    this.drawShape()
  }
}
