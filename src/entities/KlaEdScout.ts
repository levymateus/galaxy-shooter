import { Context, Textures } from "core"
import { Assets, Point, SpriteSource } from "pixi.js"
import { KlaEdBigBullet } from "./Projectile"
import { AbstractShield } from "./Shield"
import SpaceShip, {
  SpaceShipBase,
  SpaceShipDestroied,
  SpaceShipEngine,
  SpaceShipEngineIdle,
  SpaceShipFullHealth
} from "./SpaceShip"
import { SpaceShipWeapon } from "./SpaceShipWeapon"

class KlaEdScoutWeapon extends SpaceShipWeapon {
  constructor(
    public readonly parent: KlaEdScout,
    ctx: Context,
  ) {
    super(parent, "KlaEdScoutWeapon", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_scout_weapons"))
  }

  async shoot() {
    const animation = this.getAnimation()
    if (animation && !animation.playing) {
      const bullet = await this.createBullet(KlaEdBigBullet, 0, 10)
      animation.onFrameChange = (currentFrame: number) => {
        if (currentFrame === 3) bullet.shoot()
      }
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

class KlaEdScoutShield extends AbstractShield {
  constructor(
    public readonly parent: KlaEdScout,
    ctx: Context,
  ) {
    super(parent, "KalEdScoutShield", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_scout_shield"))
  }
}

export default class KlaEdScout extends SpaceShip {
  weapon: SpaceShipWeapon
  shield: KlaEdScoutShield | null

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)
    const defaultSpriteSrc = Assets.get<SpriteSource>("klaed_scout_base")
    this.initSpriteSrcs(defaultSpriteSrc)
    this.baseState = new SpaceShipFullHealth(this)

    const defaultSpritesheet = Assets.get("klaed_fighter_engine")
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
    this.spaceShipEngine.initSpritesheets(defaultSpritesheet)
    this.spaceShipEngine.state = new SpaceShipEngineIdle(this.spaceShipEngine)

    this.weapon = new KlaEdScoutWeapon(this, ctx)
    this.velocity = new Point(0, -1)
    this.shield = null
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
      const animations = (Assets.get("klaed_scout_destruction")
        .animations as Record<"destruction", Textures>)
      this.explodeAndDestroy(animations.destruction, "KlaEdScoutDestruction")
    }
  }
}
