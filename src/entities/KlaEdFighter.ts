import { Context } from "core"
import { Assets } from "pixi.js"
import { AppEvents } from "typings"
import SpaceShip, { SpaceShipEngine, SpaceShipEngineIdle, SpaceShipFullHealth } from "./SpaceShip"

export default class KlaEdFighter extends SpaceShip {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
    const defaultSpriteSrc = Assets.get("klaed_fighter_base")
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
  }
}
