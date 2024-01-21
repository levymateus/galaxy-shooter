import { Context, Textures } from "core"
import SpaceShip, {
  ISpaceShipBase,
  SpaceShipDestroied,
  SpaceShipEngine,
  SpaceShipEngineIdle,
  SpaceShipFullHealth
} from "./SpaceShip"
import { AppEvents } from "typings"
import { Assets, Point, SpriteSource } from "pixi.js"

export default class KlaEdTorpedo extends SpaceShip {
  velocity: Point

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
    const defaultSpriteSrc = Assets.get<SpriteSource>("klaed_torpedo_base")
    this.initSpriteSrcs(defaultSpriteSrc)
    this.baseState = new SpaceShipFullHealth(this)

    const defaultSpritesheet = Assets.get("klaed_torpedo_engine")
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
    this.spaceShipEngine.initSpritesheets(defaultSpritesheet)
    this.spaceShipEngine.state = new SpaceShipEngineIdle(this.spaceShipEngine)

    this.velocity = new Point(0, -1)
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
      const animations = (Assets.get("klaed_torpedo_destruction")
        .animations as Record<"destruction", Textures>)
      this.explodeAndDestroy(animations.destruction, "KlaEdTorpedoDestruction")
    }
  }
}
