import { Destructible, Restorable } from "app/typings"
import { AbstractRigidBody, Context } from "core"
import { AbstractCollision } from "core/Collision"
import { AnimatedSprite, Assets, Point, Sprite } from "pixi.js"
import { EntityUtils, MathUtils } from "utils/utils"
import Player from "./Player"

export class Asteroid
  extends AbstractRigidBody
  implements Destructible, Restorable {
  velocity: Point
  speed: Point
  rotate: number
  health = 1000
  maxHealth = 1000

  async onStart(_: Context): Promise<void> {
    this.velocity = new Point(1, 1)
    this.speed = new Point(0, 1)
    this.rotate = MathUtils.randf(0, 1)

    const base = Sprite.from(Assets.get("asteroid_base"))
    base.name = "asteroid_base"
    base.anchor.set(0.5)
    this.addChild(base)

    this.collision.shape.radius = 20
    this.collision.enable()

    this.emitter.on("outOfBounds", this.onOutOfBounds, this)
  }

  onEnterBody(collision: AbstractCollision) {
    if (EntityUtils.is(collision.parent, Player)) {
      (collision.parent as Player).takeDamage(1000)
    }
  }

  onUpdate(dt: number): void {
    this.x += this.velocity.x * this.speed.x * dt
    this.y += this.velocity.y * this.speed.y * dt
    this.angle += this.rotate
  }

  onOutOfBounds() {
    this.destroy({ children: true })
  }

  explodeAndDestroy() {
    this.removeChildren()
    const spritesheet = Assets.get("asteroid_explode")
    const sprite = new AnimatedSprite(spritesheet.animations["explode"])
    sprite.animationSpeed = 0.4
    sprite.anchor.set(0.5)
    sprite.zIndex = 0
    sprite.loop = false
    sprite.onComplete = () => {
      this.destroy({ children: true })
    }
    this.collision.disable()
    this.addChild(sprite)
    sprite.play()
  }

  takeDamage(value: number): void {
    this.health -= value

    if (this.health <= 0) {
      this.health = 0
      this.explodeAndDestroy()
    }

    if (this.health >= this.maxHealth) {
      this.health = this.maxHealth
    }
  }

  heal(value: number): void {
    this.health += value

    if (this.health >= this.maxHealth) {
      this.health = this.maxHealth
    }
  }
}
