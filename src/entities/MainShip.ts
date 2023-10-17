import { Assets } from "pixi.js"
import SpaceShip, { SpaceShipFullHealth } from "./SpaceShip"

export default class MainShip extends SpaceShip {
  async onStart(): Promise<void> {
    await super.onStart()
    this.spriteSrcs.health = Assets.get("mainship_base_full_health")
    this.spriteSrcs.slight_damaged = Assets.get("mainship_base_slight_damaged")
    this.spriteSrcs.damaged = Assets.get("mainship_base_damaged")
    this.spriteSrcs.very_damaged = Assets.get("mainship_base_very_damaged")
    this.spaceShipBase = new SpaceShipFullHealth(this)
  }
}
