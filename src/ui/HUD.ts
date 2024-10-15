import { Activity, Context } from "core"
import { PlayerScore } from "entities/PlayerScore"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { HTMLText } from "pixi.js"
import { EventNamesEnum } from "typings/enums"
import { EventTypes } from "typings/typings"
import { ContainerUtils } from "utils/utils"

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

  add({ amount }: { amount: number }): number {
    const scoreValue = this.playerScore.inc(amount)
    this.setValue(scoreValue)
    return scoreValue
  }
}

export class FloatingTextHUD extends GUIElement {
  manager: GUIManager

  async onStart(ctx: Context<EventTypes>): Promise<void> {
    ctx.anchor.set(-0.5)
    this.manager = ctx.getManager<GUIManager>()
    ctx.emitter.on(
      EventNamesEnum.SCORE_INC,
      this.logText,
      this,
    )
  }

  async logText({ amount, x, y }: { amount: number, x: number, y: number }) {
    const factory = this.manager.textFactory
    const sxText = await factory.createTextSx(`+${amount}`)

    sxText.x = x - sxText.width * 0.5
    sxText.y = y - sxText.height * 0.5

    this.addChild(sxText)

    ContainerUtils.fadeOut(sxText, 0.016, () => {
      this.removeChild(sxText)
      sxText.destroy({ children: true })
    })
  }

  onUpdate(_delta: number): void { }

  async onFinish(): Promise<void> { }
}

export class HUD implements Activity {
  private playerScoreHud: PlayerScoreHUD
  private context: Context

  async onStart(ctx: Context): Promise<void> {
    this.context = ctx

    const scoreHud = await ctx.create<PlayerScoreHUD>(PlayerScoreHUD)
    const floatingTextHud = await ctx.create<FloatingTextHUD>(FloatingTextHUD)

    this.playerScoreHud = scoreHud
    scoreHud.text.anchor.set(1)
    scoreHud.x = ctx.bounds.right - 8
    scoreHud.y = ctx.bounds.y + scoreHud.text.height + 8

    floatingTextHud.x = 0
    floatingTextHud.y = 0

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
