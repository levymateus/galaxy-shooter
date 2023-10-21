import { Context, GameObject } from "core"
import KlaEdFighter from "entities/KlaEdFighter"
import MainShip from "entities/MainShip"
import { PickupBaseEngine } from "entities/Pickup"
import { Scene } from "managers/SceneManager"
import { AppEvents } from "typings"

export default class CatalogScene extends Scene {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(0)
    const list: GameObject<AppEvents>[] = []
    list.push(await ctx.create(MainShip))
    list.push(await ctx.create(KlaEdFighter))
    list.push(await ctx.create(PickupBaseEngine))
    list.forEach((obj, index) => obj.position.set(48 * (index + 1), 48))
  }
}
