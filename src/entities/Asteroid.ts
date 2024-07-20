import { AbstractRigidBody, Context } from "core"
import { AbstractCollision } from "core/Collision"
import { AnimatedSprite, Assets, Point, Sprite } from "pixi.js"
import { MathUtils } from "utils/utils"

export class Asteroid extends AbstractRigidBody {
  velocity: Point
  speed: Point
  rotate: number

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

  onEnterBody(_: AbstractCollision) {
    this.explodeAndDestroy()
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
}
