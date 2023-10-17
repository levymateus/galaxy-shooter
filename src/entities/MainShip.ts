import { AppEvents } from "typings"
import SpaceShip from "./SpaceShip"
import { Context, GameObject } from "core"
import { Assets, Resource, Spritesheet, Texture } from "pixi.js"

export interface ISpaceShipWeapon {
  fire(): void
  equip(): void
  unequip(): void
}

export class MainShipAutoCannonWeapon extends GameObject<AppEvents> implements ISpaceShipWeapon {
  parent: SpaceShip
  spritesheets: Record<"auto_cannon", Spritesheet>

  constructor(parent: MainShip, ctx: Context<AppEvents>) {
    super(ctx, "MainShipAutoCannonWeapon")
    this.parent = parent
    this.spritesheets = {
      auto_cannon: Assets.get("mainship_weapons_auto_cannon")
    }
  }

  fire(): void {
    throw new Error("Method not implemented.")
  }

  equip(): void {
    const spritesheet = this.spritesheets.auto_cannon
    const animations = spritesheet.animations as Record<"fire", Texture<Resource>[]>
    this.parent.removeSprite("MainShipAutoCannonWeapon")
    const sprite = this.parent.addAnimatedSprite(animations.fire, "MainShipAutoCannonWeapon")
    sprite.zIndex = -1
  }

  unequip(): void {
    this.parent.removeSprite("MainShipAutoCannonWeapon")
  }
}

export default class MainShip extends SpaceShip {
  weapon: ISpaceShipWeapon

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    await super.onStart(ctx)
    this.weapon = new MainShipAutoCannonWeapon(this, ctx)
    this.weapon.equip()
  }
}
