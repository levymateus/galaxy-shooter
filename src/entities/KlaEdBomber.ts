import { Context, Textures } from "core"
import { Assets, Point, SpriteSource } from "pixi.js"
import { AppEvents } from "typings"
import { Shield } from "./Shield"
import SpaceShip, { ISpaceShipBase, SpaceShipDestroied, SpaceShipEngine, SpaceShipEngineIdle, SpaceShipFullHealth } from "./SpaceShip"

class KlaEdBomberShield extends Shield {
  parent: KlaEdBomber

  constructor(parent: KlaEdBomber, ctx: Context<AppEvents>) {
    super(parent, "KlaEdBomberShield", ctx)
    this.parent = parent
    this.setupFromSheet(Assets.get("klaed_bomber_shield"))
  }
}

export default class KlaEdBomber extends SpaceShip {
  velocity: Point
  shield: KlaEdBomberShield | null

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
    const defaultSpriteSrc = Assets.get<SpriteSource>("klaed_bomber_base")
    this.initSpriteSrcs(defaultSpriteSrc)
    this.baseState = new SpaceShipFullHealth(this)

    const defaultSpritesheet = Assets.get("klaed_bomber_engine")
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
    this.spaceShipEngine.initSpritesheets(defaultSpritesheet)
    this.spaceShipEngine.state = new SpaceShipEngineIdle(this.spaceShipEngine)

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
      const animations = (Assets.get("klaed_bomber_destruction").animations as Record<"destruction", Textures>)
      this.explodeAndDestroy(animations.destruction, "KlaEdBomberDestruction")
    }
  }
}
