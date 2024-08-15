import { FancyButton } from "@pixi/ui";
import { Activity, Context } from "core";
import { GUIManager } from "managers/GUIManager";

export default class GameOverScene implements Activity {
  async onStart(ctx: Context) {
    ctx.anchor.set(-0.5)
    const factory = ctx.getManager<GUIManager>().textFactory

    const text = await factory.createTextLg("Game Over")
    text.style.align = "center"
    text.anchor.set(0.5)

    const btnText = await factory.createText("Try again!")
    btnText.style.align = "center"
    btnText.anchor.set(0.5)

    const retryBtn = new FancyButton({
      text: btnText,
    })

    retryBtn.position.set(0, 64)
    retryBtn.onPress.connect(() => ctx.emitter.emit("startGame"));

    ctx.addChild(text)
    ctx.addChild(retryBtn)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }
}
