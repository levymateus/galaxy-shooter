import { EventNamesEnum } from "typings/enums";
import { Activity, Context } from "core";
import { GUIManager } from "managers/GUIManager";
import { ButtonText } from "ui/ButtonText";

export default class MainMenuScene implements Activity {
  async onStart(ctx: Context) {
    ctx.anchor.set(-0.5)
    const factory = ctx.getManager<GUIManager>().textFactory

    const text = await factory.createTextLg("Galaxy Shooter")
    text.style.align = "center"
    text.anchor.set(0.5)

    const startGame = await (new ButtonText(ctx, "start").create())

    startGame.position.set(0, 64)
    startGame.onPress.connect(
      () => ctx.emitter.emit(EventNamesEnum.START_GAME)
    )

    ctx.addChild(text)
    ctx.addChild(startGame)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }
}
