import { Activity, Context } from "core"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { Graphics, HTMLText } from "pixi.js"
import { ButtonText } from "./ButtonText"

export class MenuList extends GUIElement {
  titleText: HTMLText

  async onStart(ctx: Context): Promise<void> {
    const factory = ctx.getManager<GUIManager>().textFactory
    this.titleText = await factory.createTextLg("The Game is Paused!")
    const startGame = await (new ButtonText(ctx, "start").create())

    this.titleText.name = "MenuListTitle"
    this.titleText.anchor.set(0.5)
    this.titleText.position.set(0, 0)
    startGame.position.set(0, 64)

    this.addChild(this.titleText)
    this.addChild(startGame)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }

  setTitle(text: string) {
    this.titleText.text = text
  }
}

/**
 * NO USED!
 */
export class PauseMenu implements Activity {
  async onStart(ctx: Context): Promise<void> {
    ctx.anchor.set(-0.5)

    const menuList = await ctx.create<MenuList>(MenuList)
    menuList.setTitle("The Game is Paused!")

    const backdrop = new Graphics()
    backdrop.zIndex = -1
    backdrop.name = "Menu_backdrop"
    backdrop.beginFill(0x2e222f, 1)
    backdrop.drawRect(
      ctx.bounds.x,
      ctx.bounds.y,
      ctx.bounds.width,
      ctx.bounds.height
    )
    backdrop.endFill()
    ctx.addChild(backdrop)
  }

  onUpdate(): void { }
  async onFinish(): Promise<void> { }
}
