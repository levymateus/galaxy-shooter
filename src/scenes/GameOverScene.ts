import { Activity, Context } from "core"
import { GUIManager } from "managers/GUIManager"
import { EventNamesEnum } from "typings/enums"
import { ButtonText } from "ui/ButtonText"

export default class GameOverScene implements Activity {
  async onStart(ctx: Context) {
    ctx.anchor.set(-0.5)
    const manager = ctx.getManager<GUIManager>()
    const factory = manager.textFactory
    const sceneTitleText = await factory.createTextLg("Game Over")
    const startGameBtn = await (new ButtonText(ctx, "try again!").create())
    const mainMenuBtn = await (new ButtonText(ctx, "main menu").create())

    sceneTitleText.style.align = "center"
    sceneTitleText.anchor.set(0.5)
    startGameBtn.position.set(0, 64)
    mainMenuBtn.position.set(0, 128)

    startGameBtn.onPress.connect(
      () => ctx.emitter.emit(EventNamesEnum.START_GAME)
    )

    mainMenuBtn.onPress.connect(
      () => ctx.emitter.emit(EventNamesEnum.GOTO_MAIN_MENU)
    )

    ctx.addChild(sceneTitleText)
    ctx.addChild(startGameBtn)
    ctx.addChild(mainMenuBtn)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }
}
