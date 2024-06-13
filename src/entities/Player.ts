import { Context, Timer } from "core"
import MainShip from "./MainShip"
import {
  ISpaceShipBase,
  SpaceShipFullHealth,
  SpaceShipSpawning
} from "./SpaceShip"

export default class Player extends MainShip {
  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)
    const blinkTimer = new Timer()
    blinkTimer.interval(() => {
      const sprite = this.getChildByName("BaseSpaceShip")
      if (sprite) sprite.alpha = sprite.alpha ? 0 : 1
    }, 250)
    new Timer().timeout(() => {
      blinkTimer.stop()
      this.baseState = new SpaceShipFullHealth(this)
    }, 2000)
  }

  onChangeState(state: ISpaceShipBase): void {
    super.onChangeState(state)
    if (state instanceof SpaceShipSpawning) {
      console.log("spawn")
    }
  }
}
