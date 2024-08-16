import { FancyButton } from "@pixi/ui";
import { Context } from "core";
import { GUIManager } from "managers/GUIManager";

export class ButtonText {
  constructor(
    private readonly ctx: Context,
    private readonly text: string
  ) { }

  async create() {
    const factory = this.ctx.getManager<GUIManager>().textFactory
    const btnText = await factory.createTextSx(this.text.toUpperCase())

    btnText.style.align = "center"
    btnText.anchor.set(0.5)

    const btn = new FancyButton({
      text: btnText,
    })

    this.ctx.addChild(btn)

    return btn
  }
}
