import { Context } from "core"
import { PlayerScore } from "entities/PlayerScore"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { HTMLText } from "pixi.js"

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
