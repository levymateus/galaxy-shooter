import { Context, Textures, Timer } from "core"
import { Assets, Point, SpriteSource } from "pixi.js"
import { MathUtils } from "utils/utils"
import { AbstractProjectile, KlaEdWaveBullet } from "./Projectile"
import { AbstractShield } from "./Shield"
import SpaceShip, {
  SpaceShipBase,
  SpaceShipDestroied,
  SpaceShipEngine,
  SpaceShipEngineIdle,
  SpaceShipFullHealth
} from "./SpaceShip"
import { SpaceShipWeapon } from "./SpaceShipWeapon"

class KlaEdBattleCruiserWeapon extends SpaceShipWeapon {
  constructor(
    public readonly parent: KlaEdBattleCruiser,
    ctx: Context
  ) {
    super(parent, "KlaEdBattlecruiser", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_battlecruiser_weapons"))
  }

  private onFrameChange(bullet: AbstractProjectile[]) {
    return function whenFrameChange(currentFrame: number) {
      if (currentFrame === 7) bullet[0]?.shoot()
      if (currentFrame === 10) bullet[1]?.shoot()
      if (currentFrame === 7) bullet[2]?.shoot()
      if (currentFrame === 10) bullet[3]?.shoot()
      if (currentFrame === 23) bullet[4]?.shoot()
      if (currentFrame === 26) bullet[5]?.shoot()
      if (currentFrame === 23) bullet[6]?.shoot()
      if (currentFrame === 26) bullet[7]?.shoot()
    }
  }

  async shootLeft() {
    const bullet1 = await this.createBullet(
      KlaEdWaveBullet,
      -20, 30,
      MathUtils.rotatePoint(this.parent.velocity, 90)
    )
    bullet1.scale.set(0.6)
    const bullet2 = await this.createBullet(
      KlaEdWaveBullet,
      -20, 30,
      MathUtils.rotatePoint(this.parent.velocity, 90)
    )
    bullet2.scale.set(0.6)
    const bullet3 = await this.createBullet(
      KlaEdWaveBullet,
      -20, 8,
      MathUtils.rotatePoint(this.parent.velocity, 90)
    )
    bullet3.scale.set(0.6)
    const bullet4 = await this.createBullet(
      KlaEdWaveBullet,
      -20, 8,
      MathUtils.rotatePoint(this.parent.velocity, 90)
    )
    bullet4.scale.set(0.6)
    const bullet5 = await this.createBullet(
      KlaEdWaveBullet,
      20, 30,
      MathUtils.rotatePoint(this.parent.velocity, -90)
    )
    bullet5.scale.set(0.6)
    const bullet6 = await this.createBullet(
      KlaEdWaveBullet,
      20, 30,
      MathUtils.rotatePoint(this.parent.velocity, -90)
    )
    bullet6.scale.set(0.6)
    const bullet7 = await this.createBullet(
      KlaEdWaveBullet,
      20, 8,
      MathUtils.rotatePoint(this.parent.velocity, -90)
    )
    bullet7.scale.set(0.6)
    const bullet8 = await this.createBullet(
      KlaEdWaveBullet,
      20, 8,
      MathUtils.rotatePoint(this.parent.velocity, -90)
    )
    bullet8.scale.set(0.6)
    const animation = this.getAnimation()
    if (animation && !animation.playing) {
      animation.onFrameChange = this.onFrameChange([
        bullet1,
        bullet2,
        bullet3,
        bullet4,
        bullet5,
        bullet6,
        bullet7,
        bullet8,
      ])
      animation.onComplete = () => animation.gotoAndStop(0)
      animation.loop = false
      animation.gotoAndPlay(0)
    }
  }

  async shootRight() {

  }

  fire(): void {
    if (this.ready) this.shootLeft()
    super.fire()
  }
}

class KlaEdBattleCruiseShield extends AbstractShield {
  constructor(
    public readonly parent: KlaEdBattleCruiser,
    ctx: Context
  ) {
    super(parent, "KlaEdBattleCruiser", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_battlecruiser_shield"))
  }
}

export default class KlaEdBattleCruiser extends SpaceShip {
  velocity: Point
  weapon: KlaEdBattleCruiserWeapon
  shield: KlaEdBattleCruiseShield | null

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)
    const defaultSpriteSrc = Assets.get<SpriteSource>(
      "klaed_battlecruiser_base"
    )
    this.initSpriteSrcs(defaultSpriteSrc)
    this.baseState = new SpaceShipFullHealth(this)

    const defaultSpritesheet = Assets.get("klaed_battlecruiser_engine")
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
    this.spaceShipEngine.initSpritesheets(defaultSpritesheet)
    this.spaceShipEngine.state = new SpaceShipEngineIdle(
      this.spaceShipEngine
    )

    this.weapon = new KlaEdBattleCruiserWeapon(this, ctx)
    this.velocity = new Point(0, -1)

    this.weapon.equip(1)
    new Timer().interval(1000, () => this.weapon.fire())

    this.shield = new KlaEdBattleCruiseShield(this, ctx)
  }

  onUpdate() {
    this.look(this.velocity.multiply(new Point(100, 100)))
  }

  changeState(state: SpaceShipBase): void {
    super.changeState(state)
    this.onChangeState(state)
  }

  onChangeState(state: SpaceShipBase): void {
    if (state instanceof SpaceShipDestroied) {
      const animations = (Assets.get("klaed_battlecruiser_destruction")
        .animations as Record<"destruction", Textures>)
      this.explodeAndDestroy(
        animations.destruction,
        "KlaEdBattlecruiserDestruction"
      )
    }
  }
}
