import store from "app/stores"
import { Activity, Context } from "core"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { HTMLText } from "pixi.js"
import { EventNamesEnum } from "typings/enums"

export class PlayerScoreHUD extends GUIElement {
  static MASK = "00000000"
  count: number
  text: HTMLText

  async onStart(ctx: Context) {
    ctx.anchor.set(-0.5)
    this.count = store.playerScore
    const factory = ctx.getManager<GUIManager>().textFactory
    this.text = await factory.createText(PlayerScoreHUD.MASK)
    this.addChild(this.text)
    this.setValue(this.count)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> {
    store.playerScore = this.count
  }

  private pad(value: number, size: number) {
    const strValue: string = PlayerScoreHUD.MASK + value
    return strValue.substring(strValue.length - size)
  }

  setValue(value: number) {
    this.text.text = this.pad(value, PlayerScoreHUD.MASK.length)
  }

  add(amount: number): number {
    this.count = this.count + amount
    store.playerScore = this.count
    this.setValue(this.count)
    return this.count
  }
}

export class HUD implements Activity {
  private score: PlayerScoreHUD

  async onStart(ctx: Context): Promise<void> {
    const score = await ctx.create<PlayerScoreHUD>(PlayerScoreHUD)
    this.score = score
    score.text.anchor.set(1)
    score.x = ctx.bounds.right - 8
    score.y = ctx.bounds.y + score.text.height + 8
    ctx.emitter.on(EventNamesEnum.SCORE_INC, score.add, score)
    ctx.zIndex = 1000
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> {
    // BUG: score undefined quando aperta escape repetidas vezes
    return await this.score.onFinish()
  }
}
