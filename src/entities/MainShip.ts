import { Actions, Context, Input, Timer } from "core"
import {
  AnimatedSprite,
  Assets,
  Point,
  SpriteSource,
  Spritesheet
} from "pixi.js"
import { AppEvents } from "typings"
import { FrameObjects } from "utils/utils"
import {
  AutoCannonBullet,
  BigGunProjectile,
  Projectile, RocketProjectile, ZapperProjectile
} from "./Projectile"
import SpaceShip, {
  ISpaceShipBase,
  SpaceShipDestroied,
  SpaceShipEngine,
  SpaceShipEngineIdle,
  SpaceShipSpawning
} from "./SpaceShip"
import { ISpaceShipWeapon, SpaceShipWeapon } from "./SpaceShipWeapon"
import { IShield } from "./Shield"
import createSmallExplosion from "vfx/smallExplosion"

export class MainShipAutoCannonWeapon extends SpaceShipWeapon {
  parent: MainShip

  constructor(parent: MainShip, ctx: Context<AppEvents>) {
    super(parent, "MainShipAutoCannonWeapon", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("mainship_weapons_auto_cannon"))
  }

  private onFrameChange(left: AutoCannonBullet, right: AutoCannonBullet) {
    return function whenFrameChange(currentFrame: number) {
      if (currentFrame === 2) left.shoot()
      if (currentFrame === 2) right.shoot()
    }
  }

  async shoot() {
    const leftBullet = await this.createBullet(AutoCannonBullet, -8, 12)
    const rightBullet = await this.createBullet(AutoCannonBullet, 8, 12)
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

export class MainShipBigSpaceWeapon extends SpaceShipWeapon {
  constructor(parent: MainShip, ctx: Context<AppEvents>) {
    super(parent, "MainShipBigSpaceWeapon", ctx)
    this.setupFromSheet(Assets.get("mainship_weapons_big_space_gun"))
  }

  async shoot() {
    const animation = this.getAnimation()
    if (animation && !animation.playing) {
      const bullet = await this.createBullet(BigGunProjectile, 0, 12)
      animation.onFrameChange = (currentFrame: number) => {
        if (currentFrame === 5) bullet.shoot()
      }
      animation.loop = false
      animation.gotoAndPlay(0)
    }

  }

  fire(): void {
    if (this.ready) this.shoot()
    super.fire()
  }

  equip(): void {
    super.equip()
    const sprite = this.getAnimation() as AnimatedSprite
    sprite.gotoAndStop(8)
  }
}

export class MainShipRocketsWeapon extends SpaceShipWeapon {
  parent: MainShip

  constructor(parent: MainShip, ctx: Context<AppEvents>) {
    super(parent, "MainShipRocketsWeapon", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("mainship_weapons_rockets"))
  }

  async shoot() {
    const animation = this.getAnimation()
    if (animation && !animation.playing) {
      const rockets: Projectile[] = [
        await this.createBullet(RocketProjectile, 6, 16),
        await this.createBullet(RocketProjectile, -6, 16),
        await this.createBullet(RocketProjectile, 10, 20),
        await this.createBullet(RocketProjectile, -10, 20),
        await this.createBullet(RocketProjectile, 14, 10),
        await this.createBullet(RocketProjectile, -14, 10)
      ]
      animation.onFrameChange = (currentFrame) => {
        if (currentFrame === 3) rockets[0]?.shoot()
        if (currentFrame === 5) rockets[1]?.shoot()
        if (currentFrame === 7) rockets[2]?.shoot()
        if (currentFrame === 9) rockets[3]?.shoot()
        if (currentFrame === 11) rockets[4]?.shoot()
        if (currentFrame === 13) rockets[5]?.shoot()
      }
      animation.loop = false
      animation.animationSpeed = 0.2
      animation.gotoAndPlay(0)
    }
  }

  fire(): void {
    if (this.ready) this.shoot()
    super.fire()
  }
}

export class MainShipZapperWeapon extends SpaceShipWeapon {
  time: number

  constructor(parent: MainShip, ctx: Context<AppEvents>) {
    super(parent, "MainShipZapperWeapon", ctx)
    this.setupFromSheet(Assets.get("mainship_weapons_zapper"))
    this.time = 1000
  }

  equip(): void {
    this.parent.removeChildByName(this.name)
    const frames = FrameObjects.from(this.animations.fire)
    if (frames && frames[5]) frames[5].time = this.time
    const sprite = this.parent.addAnimatedSprite(frames, this.name)
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 1
    sprite.zIndex = -1
  }

  async shoot() {
    const animation = this.getAnimation()
    if (animation && !animation.playing) {
      const leftZapper = await this.createBullet(ZapperProjectile, 8, 9)
      const rightZapper = await this.createBullet(ZapperProjectile, -8, 9)
      animation.onFrameChange = (currentFrame: number) => {
        if (currentFrame === 5) {
          leftZapper.shoot()
          rightZapper.shoot()
        }
        if (currentFrame === 10) {
          leftZapper.visible = false
          rightZapper.visible = false
          leftZapper.destroy({ children: true })
          rightZapper.destroy({ children: true })
        }
      }
      animation.onComplete = () => animation.gotoAndStop(0)
      animation.loop = false
      animation.play()
    }
  }

  fire(): void {
    if (this.ready) this.shoot()
    super.fire()
  }
}

export class MainShipBigPulseEngine extends SpaceShipEngine {
  constructor(spaceShip: SpaceShip, ctx: Context<AppEvents>) {
    super(spaceShip, ctx)
    this.spritesheets.engine_idle =
      Assets.get<Spritesheet>("mainship_big_pulse_engine_idle")
    this.spritesheets.engine_power =
      Assets.get<Spritesheet>("mainship_big_pulse_engine_powering")
    this.state = new SpaceShipEngineIdle(this)
    this.setupFromSrc(Assets.get<SpriteSource>("mainship_big_pulse_engine"))
  }
}

export class MainShipBurstEngine extends SpaceShipEngine {
  constructor(spaceShip: SpaceShip, ctx: Context<AppEvents>) {
    super(spaceShip, ctx)
    this.spritesheets.engine_idle =
      Assets.get<Spritesheet>("mainship_burst_engine_idle")
    this.spritesheets.engine_power =
      Assets.get<Spritesheet>("mainship_burst_engine_powering")
    this.state = new SpaceShipEngineIdle(this)
    this.setupFromSrc(Assets.get<SpriteSource>("mainship_burst_engine"))
  }
}

export class MainShipSuperchargedEngine extends SpaceShipEngine {
  constructor(spaceShip: SpaceShip, ctx: Context<AppEvents>) {
    super(spaceShip, ctx)
    this.spritesheets.engine_idle =
      Assets.get<Spritesheet>("mainship_supercharged_engine_idle")
    this.spritesheets.engine_power =
      Assets.get<Spritesheet>("mainship_supercharged_engine_powering")
    this.state = new SpaceShipEngineIdle(this)
    this.setupFromSrc(Assets.get<SpriteSource>("mainship_supercharged_engine"))
  }
}

export default class MainShip extends SpaceShip {
  weapon: ISpaceShipWeapon | null
  shield: IShield | null
  velocity: Point
  friction: Point
  speed: Point

  private debounce: Timer

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
    this.weapon = null
    this.shield = null
    this.spaceShipEngine = null
    this.velocity = new Point(0, 0)
    this.speed = new Point(1.00, 1.00)
    this.friction = new Point(0.06, 0.06)
    this.debounce = new Timer()
  }

  onUpdate(delta: number) {
    if (this.velocity.y >= 0) this.velocity.y -= this.friction.y
    if (this.velocity.y <= 0) this.velocity.y += this.friction.y
    if (this.velocity.x >= 0) this.velocity.x -= this.friction.x
    if (this.velocity.x <= 0) this.velocity.x += this.friction.x

    if (Input.pressed) this.debounce.debounce(
      () => this.velocity.set(0, 0), 500
    )

    const canMove = !(this.baseState instanceof SpaceShipSpawning)

    if (canMove && Input.isActionPressed(Actions.MOVE_UP))
      this.velocity.y = -this.speed.y
    if (canMove && Input.isActionPressed(Actions.MOVE_RIGHT))
      this.velocity.x = this.speed.x
    if (canMove && Input.isActionPressed(Actions.MOVE_LEFT))
      this.velocity.x = -this.speed.x
    if (canMove && Input.isActionPressed(Actions.MOVE_DOWN))
      this.velocity.y = this.speed.y

    if (this.weapon instanceof MainShipAutoCannonWeapon) this.weapon.fire()
    else if (Input.isActionPressed(Actions.WEAPON_FIRE)) this.weapon?.fire()

    this.move(this.velocity.x * delta, this.velocity.y * delta)
  }

  changeState(state: ISpaceShipBase): void {
    super.changeState(state)
    this.onChangeState(state)
  }

  onChangeState(state: ISpaceShipBase): void {
    if (state instanceof SpaceShipDestroied) {
      const destruction = createSmallExplosion()
      destruction.pos.x = this.position.x
      destruction.pos.y = this.position.y
      this.context.emitter.emit('dispathVFX', destruction)
      this.destroy({ children: true })
    }
  }
}
