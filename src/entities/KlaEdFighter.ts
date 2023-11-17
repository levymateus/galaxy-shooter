import { Context, Textures } from "core"
import { Assets, Point, SpriteSource } from "pixi.js"
import { AppEvents } from "typings"
import SpaceShip, { ISpaceShipBase, SpaceShipDestroied, SpaceShipEngine, SpaceShipEngineIdle, SpaceShipFullHealth } from "./SpaceShip"
import { SpaceShipWeapon } from "./SpaceShipWeapon"
import { KlaEdFighterProjectile, Projectile } from "./Projectile"
import { Shield } from "./Shield"

class KlaEdFighterWeapon extends SpaceShipWeapon {
  parent: KlaEdFighter

  constructor(parent: KlaEdFighter, ctx: Context<AppEvents>) {
    super(parent, "KlaEdFighterWeapon", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_fighter_weapons"))
  }

  private onFrameChange(left: Projectile, right: Projectile) {
    return function whenFrameChange(currentFrame: number) {
      if (currentFrame === 2) left.shoot()
      if (currentFrame === 2) right.shoot()
    }
  }

  async shoot() {
    const leftBullet = await this.createBullet(KlaEdFighterProjectile, -8, 12)
    const rightBullet = await this.createBullet(KlaEdFighterProjectile, 8, 12)
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

class KlaEdShield extends Shield {
  parent: KlaEdFighter

  constructor(parent: KlaEdFighter, ctx: Context<AppEvents>) {
    super(parent, "KlaEdShield", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_fighter_shield"))
  }
}

export default class KlaEdFighter extends SpaceShip {
  weapon: SpaceShipWeapon
  velocity: Point
  shield: KlaEdShield | null

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
    const defaultSpriteSrc = Assets.get<SpriteSource>("klaed_fighter_base")
    this.spriteSrcs.health = defaultSpriteSrc
    this.spriteSrcs.slight_damaged = defaultSpriteSrc
    this.spriteSrcs.damaged = defaultSpriteSrc
    this.spriteSrcs.very_damaged = defaultSpriteSrc
    this.baseState = new SpaceShipFullHealth(this)
    const defaultSpritesheet = Assets.get("klaed_fighter_engine")
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
    this.spaceShipEngine.spritesheets.engine_idle = defaultSpritesheet
    this.spaceShipEngine.spritesheets.engine_power = defaultSpritesheet
    this.spaceShipEngine.state = new SpaceShipEngineIdle(this.spaceShipEngine)
    this.weapon = new KlaEdFighterWeapon(this, ctx)
    this.velocity = new Point(0, -1)
    this.shield = null
  }

  onUpdate(): void {
    this.look(this.velocity.multiply(new Point(100, 100)))
  }

  changeState(state: ISpaceShipBase): void {
    super.changeState(state)
    this.onChangeState(state)
  }

  onChangeState(state: ISpaceShipBase): void {
    if (state instanceof SpaceShipDestroied) {
      const animations = (Assets.get("klaed_fighter_destruction").animations as Record<"destruction", Textures>)
      const sprite = this.addAnimatedSprite(animations.destruction, "KlaEdFighterDestruction")
      this.removeChildByName("BaseSpaceShip")
      this.removeChildByName("SpaceShipBaseEngine")
      this.removeChildByName("SpaceShipEngine")
      sprite.onComplete = () => this.destroy({ children: true })
      sprite.loop = false
      sprite.animationSpeed = 0.4
      sprite.play()
    }
  }
}
