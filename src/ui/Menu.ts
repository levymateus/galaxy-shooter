import { Activity, Context } from "core"
import { GUIElement } from "managers/GUIManager"
import { Graphics } from "pixi.js"
import { AppEvents } from "typings"
import { Text } from "ui"

export class MenuList extends GUIElement {
  async onStart(): Promise<void> { }

  onUpdate(): void { }

  async onFinish(): Promise<void> { }

  setTitle(text: string) {
    const name = "MenuListTitle"
    const textTitle = new Text(text)
    textTitle.name = name
    textTitle.anchor.set(0.5)
    textTitle.x = 0
    textTitle.y = 0
    textTitle.weight("bold")
    this.removeChildByName(name)
    this.addChild(textTitle)
  }

  removeChildByName(name: string) {
    const child = this.getChildByName(name)
    child?.removeFromParent()
    child?.destroy()
  }
}

export class Menu implements Activity<AppEvents>  {
  async onStart(ctx: Context<AppEvents>): Promise<void> {
    ctx.sortableChildren = true

    const menuList = await ctx.create<MenuList>(MenuList)
    menuList.setTitle("The Game is Paused!")

    const backdrop = new Graphics()
    backdrop.zIndex = -1
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
