import { Context } from "core"
import KlaEdFighter from "entities/KlaEdFighter"
import MainShip from "entities/MainShip"
import { Scene } from "managers/SceneManager"
import { AppEvents } from "typings"

export default class MainScene extends Scene {
  m: MainShip
  o: KlaEdFighter

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    super.onStart(ctx)
  }

  onUpdate(dt: number): void {
    super.onUpdate(dt)
  }
}
