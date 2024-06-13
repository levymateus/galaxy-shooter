import {
  Context, GameObject,
} from "core"
import KlaEdBomber from "entities/KlaEdBomber"
import KlaEdFighter from "entities/KlaEdFighter"
import KlaEdScout from "entities/KlaEdScout"
import KlaEdSupport from "entities/KlaEdSupport"
import KlaEdTorpedo from "entities/KlaEdTorpedo"
import MainShip from "entities/MainShip"
import { Scene } from "managers/SceneManager"

export default class CatalogScene extends Scene {
  async onStart(ctx: Context): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(0)
    const list: GameObject[] = []
    list.push(await ctx.create(MainShip))
    list.push(await ctx.create(KlaEdFighter))
    list.push(await ctx.create(KlaEdScout))
    list.push(await ctx.create(KlaEdSupport))
    list.push(await ctx.create(KlaEdBomber))
    list.push(await ctx.create(KlaEdTorpedo))
    list.forEach((obj, index) => obj.position.set(48 * (index + 1), 48))
  }
}
