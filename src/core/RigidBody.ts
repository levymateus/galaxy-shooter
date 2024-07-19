import { Circle } from "pixi.js";
import { AbstractCollision } from "./Collision";
import { Context } from "./Context";
import { AbstractGameObject } from "./GameObject";
import { Collideable, RigidBody } from "./typings";

/**
 * Abstract RigidBody is a AbstractGameObject that
 * implements RigidBody interface.
 */
export class AbstractRigidBody extends AbstractGameObject implements RigidBody {
  protected collision: AbstractCollision

  constructor(
    public context: Context,
    name: string,
  ) {
    super(context, name)
    this.collision = new AbstractCollision(this, new Circle(0, 0, 0))
    this.emitter.on("onCollision", this.onCollide, this)
    this.emitter.on("onCollisionEnter", this.onEnterBody, this)
    this.emitter.on("onCollisionExit", this.onExitBody, this)
  }

  onEnterBody(_: Collideable): void { }

  onCollide(_: Collideable): void { }

  onExitBody(_: Collideable): void { }
}
