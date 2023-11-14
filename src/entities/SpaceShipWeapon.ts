import { ActivityElementCtor, Context, GameObject, Textures, Timer } from "core"
import { AnimatedSprite, Assets, Point, Spritesheet } from "pixi.js"
import { AppEvents, IPickUp } from "typings"
import { MathUtils } from "utils/utils"
import { Projectile } from "./Projectile"
import SpaceShip from "./SpaceShip"

export type SpaceShipWeaponAnimations = Record<"fire", Textures>

export interface ISpaceShipWeapon extends IPickUp {
  fire(): void
  animations: SpaceShipWeaponAnimations
}

export class SpaceShipWeapon extends GameObject<AppEvents> implements ISpaceShipWeapon {
  ready: boolean
  countdown: number
  parent: SpaceShip
  name: string
  animations: SpaceShipWeaponAnimations
  protected timer: Timer

  constructor(parent: SpaceShip, name: string, ctx: Context<AppEvents>) {
    super(ctx, name)
    this.parent = parent
    this.name = name
    this.ready = true
    this.countdown = 1000
    this.timer = new Timer()
    this.setupFromSheet(Assets.get<Spritesheet>("mainship_weapons_auto_cannon"))
  }

  async createBullet(ctor: ActivityElementCtor<AppEvents>, x: number = 0, y: number = 0): Promise<Projectile> {
    const velocity = this.parent.velocity
    let position = new Point(this.parent.x + x, this.parent.y + y)
    position = this.parent.position.clone().subtract(position)
    position = MathUtils.rotatePoint(position, this.parent.angle)
    position = this.parent.position.add(position)
    return await this.context.create<Projectile>(ctor, position, velocity)
  }

  setupFromSheet(sheet: Spritesheet) {
    this.animations = sheet.animations as SpaceShipWeaponAnimations
  }

  getAnimation(): AnimatedSprite | null {
    return this.parent.getChildByName(this.name) || null
  }

  fire(): void {
    if (this.ready) {
      this.ready = false
      this.timer.timeout(() => {
        this.ready = true
      }, this.countdown)
    }
  }

  equip(): void {
    this.parent.removeChildByName(this.name)
    const sprite = this.parent.addAnimatedSprite(this.animations.fire, this.name)
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.zIndex = -1
  }

  unequip(): void {
    this.parent.removeChildByName(this.name)
  }
}
