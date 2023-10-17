import { Assets } from "pixi.js"
import SpaceShip, { SpaceShipFullHealth } from "./SpaceShip"

export default class KlaEdFighter extends SpaceShip {
  async onStart(): Promise<void> {
    await super.onStart()
    const defaultSpriteSrc = Assets.get("klaed_fighter_base")
    this.spriteSrcs.health = defaultSpriteSrc
    this.spriteSrcs.slight_damaged = defaultSpriteSrc
    this.spriteSrcs.damaged = defaultSpriteSrc
    this.spriteSrcs.very_damaged = defaultSpriteSrc
    this.spaceShipBase = new SpaceShipFullHealth(this)
  }
}
