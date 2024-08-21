import { score as scoreStore } from "app/score"
import { Activity, Context } from "core"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { HTMLText } from "pixi.js"

export class Score extends GUIElement {
  static MASK = "00000000"
  count: number
  text: HTMLText

  async onStart(ctx: Context) {
    ctx.anchor.set(-0.5)
    this.count = scoreStore.value
    const factory = ctx.getManager<GUIManager>().textFactory
    this.text = await factory.createText(Score.MASK)
    this.addChild(this.text)
    this.setValue(this.count)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> {
    scoreStore.set(this.count)
  }

  private pad(value: number, size: number) {
    const strValue: string = Score.MASK + value
    return strValue.substring(strValue.length - size)
  }

  setValue(value: number) {
    this.text.text = this.pad(value, Score.MASK.length)
  }

  add(amount: number): number {
    this.count = this.count + amount
    scoreStore.set(this.count)
    this.setValue(this.count)
    return this.count
  }
}

export class HUD implements Activity {
  private score: Score
  async onStart(ctx: Context): Promise<void> {
    const score = await ctx.create<Score>(Score)
    score.text.anchor.set(1)
    score.x = ctx.bounds.right - 8
    score.y = ctx.bounds.y + score.text.height + 8
    ctx.emitter.on("scoreIncrement", score.add, score)
    ctx.zIndex = 1000
    this.score = score
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> {
    return await this.score.onFinish()
  }
}
