import { AbstractGameObject, Context } from "core"
import { AnimatedSprite, Assets, Point, Sprite } from "pixi.js"
import { MathUtils } from "utils/utils"

export class Asteroid extends AbstractGameObject {
  velocity: Point
  speed: Point
  rotate: number

  async onStart(ctx: Context): Promise<void> {
    this.position.set(
      MathUtils.randf(ctx.bounds.x, ctx.bounds.right),
      ctx.bounds.y,
    )
    this.velocity = new Point(1, 1)
    this.speed = new Point(0, 1)
    this.rotate = MathUtils.randf(0, 1)

    const base = Sprite.from(Assets.get("asteroid_base"))
    base.name = "asteroid_base"
    base.anchor.set(0.5)
    this.addChild(base)

    this.emitter.on("outOfBounds", this.onOutOfBounds, this)
    this.emitter.on("onCollide", this.onCollide, this)
  }

  onUpdate(dt: number): void {
    this.x += this.velocity.x * this.speed.x * dt
    this.y += this.velocity.y * this.speed.y * dt
    this.angle += this.rotate
  }

  onOutOfBounds() {
    this.destroy({ children: true })
  }

  onCollide() {
    // empty
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
    this.addChild(sprite)
    sprite.play()
  }
}
