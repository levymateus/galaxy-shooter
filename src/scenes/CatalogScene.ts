import {
  Context, GameObject,
} from "core"
import KlaEdFighter from "entities/KlaEdFighter"
import MainShip from "entities/MainShip"
import { PickupBaseEngine } from "entities/Pickup"
import { BigGunProjectile, Projectile, RocketProjectile, ZapperProjectile } from "entities/Projectile"
import { Scene } from "managers/SceneManager"
import { AppEvents } from "typings"

export default class CatalogScene extends Scene {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(0)
    const list: GameObject<AppEvents>[] = []
    list.push(await ctx.create(MainShip))
    // const m = await ctx.create<MainShip>(MainShip)
    // m.position.set(200, 500)
    list.push(await ctx.create(KlaEdFighter))
    list.push(await ctx.create(PickupBaseEngine))
    list.push(await ctx.create(Projectile))
    list.push(await ctx.create(RocketProjectile))
    list.push(await ctx.create(ZapperProjectile))
    list.push(await ctx.create(BigGunProjectile))
    list.forEach((obj, index) => obj.position.set(48 * (index + 1), 48))
  }
}
