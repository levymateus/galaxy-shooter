import "@pixi/math-extras"
import { Context, Textures, Timer, Unique } from "core"
import { AbstractCollision } from "core/Collision"
import { Assets, Point, SpriteSource } from "pixi.js"
import { EventNamesEnum } from "typings/enums"
import { Destructible } from "typings/typings"
import { isDestructible } from "utils/is"
import { uuid } from "utils/uuid"
import { AbstractProjectile, KlaEdBullet } from "./Projectile"
import { AbstractShield } from "./Shield"
import SpaceShip, {
  SpaceShipBase,
  SpaceShipDestroied,
  SpaceShipEngine,
  SpaceShipEngineIdle,
  SpaceShipFullHealth
} from "./SpaceShip"
import { SpaceShipWeapon } from "./SpaceShipWeapon"
import { Asteroid } from "./Asteroid"

class KlaEdFighterWeapon extends SpaceShipWeapon {
  constructor(
    public readonly parent: KlaEdFighter,
    ctx: Context,
  ) {
    super(parent, "KlaEdFighterWeapon", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_fighter_weapons"))
  }

  private onFrameChange(left: AbstractProjectile, right: AbstractProjectile) {
    return function whenFrameChange(currentFrame: number) {
      if (currentFrame === 2) left.shoot()
      if (currentFrame === 2) right.shoot()
    }
  }

  async shoot() {
    const leftBullet = await this.createBullet(KlaEdBullet, -6, 12)
    const rightBullet = await this.createBullet(KlaEdBullet, 6, 12)
    const animation = this.getAnimation()
    if (animation && !animation.playing) {
      animation.onFrameChange = this.onFrameChange(leftBullet, rightBullet)
      animation.onComplete = () => animation.gotoAndStop(0)
      animation.loop = false
      animation.gotoAndPlay(0)
    }
  }

  fire(): void {
    if (this.ready) this.shoot()
    super.fire()
  }
}

class KlaEdFighterShield extends AbstractShield {
  constructor(
    public readonly parent: KlaEdFighter,
    ctx: Context,
  ) {
    super(parent, "KlaEdFighterShield", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_fighter_shield"))
  }
}

export default class KlaEdFighter
  extends SpaceShip
  implements Unique, Destructible {
  id = uuid()

  dead = false
  weapon: SpaceShipWeapon
  velocity = new Point(0, 1)
  speed = new Point(0.03, 0.8)
  offset = 0
  shield: KlaEdFighterShield | null

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)

    const defaultSpriteSrc = Assets.get<SpriteSource>("klaed_fighter_base")
    this.initSpriteSrcs(defaultSpriteSrc)
    this.baseState = new SpaceShipFullHealth(this)

    const defaultSpritesheet = Assets.get("klaed_fighter_engine")
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
    this.spaceShipEngine.initSpritesheets(defaultSpritesheet)
    this.spaceShipEngine.state = new SpaceShipEngineIdle(this.spaceShipEngine)

    this.weapon = new KlaEdFighterWeapon(this, ctx)
    this.shield = null

    this.collision.shape.radius = 16

    this.blink()
  }

  private async blink() {
    const sprite = this.getChildByName("BaseSpaceShip")

    const interval = new Timer()
    const timeout = new Timer()

    interval.interval(250, () => {
      if (sprite) sprite.alpha = sprite.alpha >= 1 ? 0.2 : 1
    })

    await timeout.wait(2000)

    interval.stop()

    this.collision.enable()
  }

  onEnterBody(collision: AbstractCollision) {
    const valid =
      collision.parent.name !== this.name &&
      collision.parent.name !== Asteroid.name

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
    this.position.y += this.velocity.y * this.speed.y * dt
    this.position.x = Math.sin(
      this.position.y * this.speed.x
    ) * 64 + this.offset
    this.look(this.velocity.multiply(new Point(100, 100)))
  }

  changeState(state: SpaceShipBase): void {
    super.changeState(state)
    this.onChangeState(state)
  }

  onChangeState(state: SpaceShipBase): void {
    if (state instanceof SpaceShipDestroied) {
      const animations = (Assets.get("klaed_fighter_destruction")
        .animations as Record<"destruction", Textures>)

      if (!this.dead) {
        this.context.emitter.emit(
          EventNamesEnum.SCORE_INC,
          { amount: 100, x: this.position.x, y: this.position.y }
        )
      }

      this.explodeAndDestroy(
        animations.destruction,
        "KlaEdFighterDestruction",
      )

      this.dead = true
    }
  }

  equal(u: Unique): boolean {
    return u.id === this.id
  }
}
