import { Activity, Context } from "core"
import { GUIElement, GUIManager } from "managers/GUIManager"
import { Graphics, HTMLText } from "pixi.js"

export class MenuList extends GUIElement {
  titleText: HTMLText

  async onStart(ctx: Context): Promise<void> {
    const factory = ctx.getManager<GUIManager>().textFactory
    this.titleText = await factory.createTextLg("The Game is Pauded!")
    this.titleText.name = "MenuListTitle"
    this.titleText.anchor.set(0.5)
    this.titleText.position.set(0, 0)
    this.addChild(this.titleText)
  }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }

  setTitle(text: string) {
    this.titleText.text = text
  }
}

export class Menu implements Activity {
  async onStart(ctx: Context): Promise<void> {

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
