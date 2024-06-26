import { Circle } from "pixi.js";
import { Collision } from "./Collision";
import { Context } from "./Context";
import { GameObject } from "./GameObject";
import { RigidBody as RigidBodyInterface } from "./typings";

export class RigidBody extends GameObject implements RigidBodyInterface {
  protected collision: Collision

  constructor(
    public context: Context,
    name: string,
  ) {
    super(context, name)
    this.collision = new Collision(this, new Circle(0, 0, 0))
    this.emitter.on("onCollision", this.onCollision, this)
  }

  onCollisionEnter(_: Collision): void {}

  onCollision(_: Collision): void {}

  onCollisionExit(_: Collision): void {}
}
