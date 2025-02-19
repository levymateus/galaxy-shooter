import { AbstractRigidBody, Context, Timer, Unique } from "core"
import { AbstractCollision } from "core/Collision"
import { AnimatedSprite, Assets, Point, Sprite } from "pixi.js"
import { EventNamesEnum } from "typings/enums"
import { Destructible, EventTypes, Restorable } from "typings/typings"
import { isDestructible } from "utils/is"
import { MathUtils } from "utils/utils"
import { uuid } from "utils/uuid"
import KlaEdFighter from "./KlaEdFighter"

export class Asteroid
  extends AbstractRigidBody
  implements Destructible, Restorable, Unique {
  id = uuid()

  velocity = new Point(1, 1)
  speed = new Point(0, 1)
  rotate = MathUtils.randf(0, 1)
  health = 1000
  maxHealth = 1000
  context: Context<EventTypes>

  async onStart(_: Context): Promise<void> {
    const base = Sprite.from(Assets.get("asteroid_base"))
    base.name = "asteroid_base"
    base.anchor.set(0.5)
    this.addChild(base)

    this.collision.shape.radius = 20

    this.blink()
  }

  private blink() {
    const blinkTimer = new Timer()

    blinkTimer.interval(250, () => {
      const sprite = this.getChildByName("asteroid_base")
      if (sprite) sprite.alpha = sprite.alpha ? 0 : 1
    })

    new Timer().timeout(1000, () => {
      blinkTimer.stop()
      this.collision.enable()
    })
  }

  onEnterBody(collision: AbstractCollision) {
    const valid =
      collision.parent.name !== this.name &&
      !(collision.parent.name === KlaEdFighter.name)

    if (valid && isDestructible(collision.parent)) {
      collision.parent.takeDamage(100)
    }
  }

  onCollide(_: AbstractCollision) {
    // code...
  }

  onExitBody(_: AbstractCollision) {
    // code...
  }

  onUpdate(dt: number): void {
    this.x += this.velocity.x * this.speed.x * dt
    this.y += this.velocity.y * this.speed.y * dt
    this.angle += this.rotate
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
      this.context.emitter.emit(
        EventNamesEnum.SCORE_INC,
        { amount: 100, x: this.position.x, y: this.position.y }
      )
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

  equal(object: Unique): boolean {
    return object.id === this.id
  }
}
