import { Activity, Context } from "core"
import { PlayerScore } from "entities/PlayerScore"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { HTMLText } from "pixi.js"
import { EventNamesEnum } from "typings/enums"

export class PlayerScoreHUD extends GUIElement {
  static MASK = "00000000"
  text: HTMLText
  manager: GUIManager
  playerScore: PlayerScore

  async onStart(ctx: Context) {
    ctx.anchor.set(-0.5)

    this.manager = ctx.getManager<GUIManager>()
    this.playerScore = this.manager.store.playerScore

    const factory = this.manager.textFactory

    this.text = await factory.createText(PlayerScoreHUD.MASK)

    this.addChild(this.text)
    this.setValue(this.playerScore.score)
  }

  onUpdate() { }

  async onFinish() {
    this.playerScore.score = 0
  }

  private pad(value: number, size: number) {
    const strValue: string = PlayerScoreHUD.MASK + value
    return strValue.substring(strValue.length - size)
  }

  setValue(value: number) {
    this.text.text = this.pad(value, PlayerScoreHUD.MASK.length)
  }

  add(amount: number): number {
    const scoreValue = this.playerScore.inc(amount)
    this.setValue(scoreValue)
    return scoreValue
  }
}

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
