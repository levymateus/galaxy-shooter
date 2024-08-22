import { Pickable } from "app/typings"
import { AbstractGameObject, Context, Textures } from "core"
import { Assets, Spritesheet } from "pixi.js"
import MainShip from "./MainShip"
import SpaceShip from "./SpaceShip"

export type ShieldAnimations = Record<"animation", Textures>

export interface Shield extends Pickable {
  takeDamage(value: number): void
}

export class AbstractShield extends AbstractGameObject implements Shield {
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

  takeDamage(value: number): void {
    this.health -= value
    if (this.health <= 0) {
      this.health = 0
      this.parent.getChildByName(this.name)?.destroy({ children: true })
    }
  }

  setupFromSheet(sheet: Spritesheet) {
    this.animations = sheet.animations as ShieldAnimations
  }

  equiped() {
    return !!this.parent.getChildByName(this.name)
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

export class ShieldFrontSides extends AbstractShield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldFrontSides", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_front_sides"))
  }

  takeDamage(value: number): void {
    return super.takeDamage(value)
  }
}

export class ShieldFront extends AbstractShield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldFront", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_front"))
  }

  takeDamage(value: number): void {
    return super.takeDamage(value)
  }
}

export class ShieldInvincible extends AbstractShield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldInvincible", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_invincible"))
  }

  takeDamage(value: number): void {
    return void value
  }
}

export class ShieldRound extends AbstractShield {
  constructor(
    public readonly parent: MainShip,
    ctx: Context,
  ) {
    super(parent, "ShieldRound", ctx)
    this.setupFromSheet(Assets.get("mainship_shield_round"))
  }

  takeDamage(value: number): void {
    return super.takeDamage(value)
  }
}
