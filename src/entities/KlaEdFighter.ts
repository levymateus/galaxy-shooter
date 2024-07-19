import { Context, Textures } from "core"
import { Assets, Point, SpriteSource } from "pixi.js"
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

export default class KlaEdFighter extends SpaceShip {
  weapon: SpaceShipWeapon
  velocity: Point
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
    this.velocity = new Point(0, -1)
    this.shield = null
  }

  onUpdate(): void {
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
      this.explodeAndDestroy(animations.destruction, "KlaEdFighterDestruction")
    }
  }
}
