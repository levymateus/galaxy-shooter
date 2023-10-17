import { Assets } from "pixi.js"
import SpaceShip, { SpaceShipEngineIdle, SpaceShipFullHealth } from "./SpaceShip"
import { AppEvents } from "typings"
import { Context } from "core"

export default class KlaEdFighter extends SpaceShip {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)

    const defaultSpriteSrc = Assets.get("klaed_fighter_base")
    this.spriteSrcs.health = defaultSpriteSrc
    this.spriteSrcs.slight_damaged = defaultSpriteSrc
    this.spriteSrcs.damaged = defaultSpriteSrc
    this.spriteSrcs.very_damaged = defaultSpriteSrc

    const defaultSpritesheet = Assets.get("klaed_fighter_engine")
    this.spaceShipEngine.spritesheets.engine_idle = defaultSpritesheet
    this.spaceShipEngine.spritesheets.engine_power = defaultSpritesheet

    this.state = new SpaceShipFullHealth(this)
    this.spaceShipEngine.state = new SpaceShipEngineIdle(this.spaceShipEngine)
  }
}
