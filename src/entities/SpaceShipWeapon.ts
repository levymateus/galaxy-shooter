import { Pickable } from "app/typings"
import { AbstractGameObject, ActivityElementCtor, Context, Textures, Timer } from "core"
import { AnimatedSprite, Assets, Point, Spritesheet } from "pixi.js"
import { MathUtils } from "utils/utils"
import { AbstractProjectile } from "./Projectile"
import SpaceShip from "./SpaceShip"

export type SpaceShipWeaponAnimations = Record<"fire", Textures>

export interface ISpaceShipWeapon extends Pickable {
  fire(): void
  animations: SpaceShipWeaponAnimations
}

export class SpaceShipWeapon
  extends AbstractGameObject
  implements ISpaceShipWeapon {
  ready = true
  countdown = 3000
  name: string
  animations: SpaceShipWeaponAnimations
  protected timer = new Timer()

  constructor(
    public readonly parent: SpaceShip,
    name: string,
    ctx: Context,
  ) {
    super(ctx, name)
    this.parent = parent
    this.name = name
    this.setupFromSheet(Assets.get<Spritesheet>("mainship_weapons_auto_cannon"))
  }

  async createBullet(
    ctor: ActivityElementCtor,
    x: number = 0,
    y: number = 0,
    velocity: Point = this.parent.velocity,
  ): Promise<AbstractProjectile> {
    let position = new Point(this.parent.x + x, this.parent.y + y)
    position = this.parent.position.clone().subtract(position)
    position = MathUtils.rotatePoint(position, this.parent.angle)
    position = this.parent.position.add(position)
    return await this.context.create<AbstractProjectile>(ctor, position, velocity)
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
      this.timer.timeout(this.countdown, () => {
        this.ready = true
      })
    }
  }

  equiped() {
    return !!this.parent.getChildByName(this.name)
  }

  equip(zIndex?: number): void {
    this.parent.removeChildByName(this.name)
    const sprite =
      this.parent.addAnimatedSprite(this.animations.fire, this.name)
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.zIndex = zIndex || -1
  }

  unequip(): void {
    this.parent.removeChildByName(this.name)
  }
}
