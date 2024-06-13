import { Context } from "core"
import MainShip from "entities/MainShip"
import Player from "entities/Player"
import { Scene } from "managers/SceneManager"

export default class MainScene extends Scene {
  async onStart(ctx: Context): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)
    const p1 = await ctx.create<Player>(Player)
    const p2 = await ctx.create<MainShip>(MainShip)
    p1.position.set(0, 0)
    p2.position.set(32, 0)
  }
}
