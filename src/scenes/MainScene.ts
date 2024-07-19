import { Context } from "core"
import Player from "entities/Player"
import { Scene } from "managers/SceneManager"

export default class MainScene extends Scene {
  async onStart(ctx: Context): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)
    const p1 = await ctx.create<Player>(Player)
    p1.position.set(0, 0)
  }
}
