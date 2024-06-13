import { Context, GameObject, Textures } from "core"
import { Assets, Spritesheet } from "pixi.js"
import { IPickUp } from "typings"
import MainShip from "./MainShip"
import SpaceShip from "./SpaceShip"

export type ShieldAnimations = Record<"animation", Textures>

export interface IShield extends IPickUp {
  damage(value: number): void
}

export class Shield extends GameObject implements IShield {
  health: number
  animations: ShieldAnimations

  constructor(
    public readonly parent: SpaceShip,
    name: string,
    ctx: Context,
  ) {
    super(ctx, name)
    this.parent = parent
    this.health = 100
  }

  damage(value: number): void {
    this.health -= value
    if (this.health <= 0) {
      this.health = 0
      this.parent.getChildByName(this.name)?.destroy({ children: true })
    }
  }

  setupFromSheet(sheet: Spritesheet) {
    this.animations = sheet.animations as ShieldAnimations
  }

  equip(): void {
    this.parent.removeChildByName(this.name)
    const sprite =
      this.parent.addAnimatedSprite(this.animations.animation, this.name)
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.zIndex = 10
    sprite.play()
  }

  unequip(): void {
    this.parent.removeChildByName(this.name)
  }
}

export class ShieldFrontSides extends Shield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldFrontSides", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_front_sides"))
  }

  damage(value: number): void {
    return super.damage(value)
  }
}

export class ShieldFront extends Shield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldFront", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_front"))
  }

  damage(value: number): void {
    return super.damage(value)
  }
}

export class ShieldInvincible extends Shield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldInvincible", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_invincible"))
  }

  damage(value: number): void {
    return void value
  }
}

export class ShieldRound extends Shield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldRound", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_round"))
  }

  damage(value: number): void {
    return super.damage(value)
  }
}
