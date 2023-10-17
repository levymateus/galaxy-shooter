import { AppEvents } from "typings"
import SpaceShip from "./SpaceShip"
import { Context } from "core"

export default class MainShip extends SpaceShip {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
  }
}
