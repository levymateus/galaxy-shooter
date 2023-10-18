import { Activity, Context } from "core";
import { GUIElement } from "managers/GUIManager";
import { AppEvents } from "typings";
import { Text } from "ui";

export class Score extends GUIElement {
  private static MASK = "00000000";
  private count: number
  text: Text

  async onStart() {
    this.count = 0
    this.text = new Text(Score.MASK)
    this.text.weight("bold")
    this.addChild(this.text)
  }

  onUpdate(): void { }
  async onFinish(): Promise<void> { }

  private pad(value: number, size: number) {
    const strValue: string = Score.MASK + value
    return strValue.substring(strValue.length - size)
  }

  setValue(value: number) {
    this.text.text = this.pad(value, Score.MASK.length)
  }

  add(amount: number): number {
    this.count = this.count + amount
    this.setValue(this.count)
    return this.count
  }
}


export class HUD implements Activity<AppEvents> {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    const score = await ctx.create<Score>(Score)
    score.text.anchor.set(1)
    score.x = ctx.bounds.right - 8
    score.y = ctx.bounds.y + score.text.height + 8
    ctx.emitter.on("scoreIncrement", score.add, score)
    ctx.zIndex = 1000
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }
}
