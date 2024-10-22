import { Activity, Context } from "core"
import { EventNamesEnum } from "typings/enums"
import { PlayerScoreHUD } from "./PlayerScoreHUD"

export class HUD implements Activity {
  private playerScoreHud: PlayerScoreHUD
  private context: Context

  async onStart(ctx: Context): Promise<void> {
    this.context = ctx

    const scoreHud = await ctx.create<PlayerScoreHUD>(PlayerScoreHUD)

    this.playerScoreHud = scoreHud
    scoreHud.text.anchor.set(1)
    scoreHud.x = ctx.bounds.right - 8
    scoreHud.y = ctx.bounds.y + scoreHud.text.height + 8

    ctx.emitter.on(
      EventNamesEnum.SCORE_INC,
      scoreHud.add,
      scoreHud,
    )

    ctx.zIndex = 1000
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> {
    this.context.emitter.removeListener(
      EventNamesEnum.SCORE_INC,
      this.playerScoreHud.add,
      this.playerScoreHud,
    )

    return await this.playerScoreHud.onFinish()
  }
}
