import { Context, GameObject, Textures, Timer } from "core"
import { AnimatedSprite, Assets, Point, Spritesheet } from "pixi.js"
import { AppEvents } from "typings"
import { FrameObjects, MathUtils } from "utils/utils"
import { SpaceShipWeapon } from "./SpaceShipWeapon"

export type ProjectileAnimations = Record<"shoot", Textures>

export interface IProjectile {
  animations: ProjectileAnimations
  shoot(): void
}

export class Projectile extends GameObject<AppEvents> implements IProjectile {
  animations: ProjectileAnimations
  weapon: SpaceShipWeapon
  velocity: Point
  countdown: number

  protected spritesheet: Spritesheet
  protected timer: Timer

  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    const position = args[0]
    const velocity = args[1]

    if (position && position instanceof Point)
      this.position.set(position.x, position.y)

    this.velocity = new Point()

    if (velocity && velocity instanceof Point)
      this.velocity.set(velocity.x, velocity.y)

    this.zIndex = -10
    this.countdown = 5000
    this.timer = new Timer()
    this.spritesheet =
      Assets.get<Spritesheet>("mainship_weapons_projectile_auto_cannon_bullet")
    return void context
  }

  setupFromSheet(sheet: Spritesheet) {
    this.animations = sheet.animations as ProjectileAnimations
    this.removeChildByName("AnimatedSprite")
    const sprite = this.addAnimatedSprite(
      this.animations.shoot, "AnimatedSprite"
    )
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.zIndex = -2
    sprite.play()
  }

  getAnimation(): AnimatedSprite | null {
    return this.parent.getChildByName("AnimatedSprite") || null
  }

  startCount() {
    this.timer.timeout(() => this.destroy({ children: true }), this.countdown)
  }

  shoot(): void {
    this.setupFromSheet(this.spritesheet)
    this.startCount()
  }

  move(x: number, y: number) {
    this.position.x += x
    this.position.y += y
  }
}

export class AutoCannonBullet extends Projectile {
  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    await super.onStart(context, ...args)
  }

  shoot(): void {
    this.velocity = new Point(0, -2)
    super.shoot()
  }

  onUpdate(delta: number): void {
    this.look(this.velocity.normalize().multiply(new Point(100, 100)))
    this.move(this.velocity.x * delta, this.velocity.y * delta)
  }
}

export class RocketProjectile extends Projectile {
  private go: boolean
  private speed: Point
  private static MIN_MAX_SPEED: [Point, Point] = [
    new Point(1, 1),
    new Point(2, 2)
  ]

  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    await super.onStart(context, ...args)
    this.go = false
    this.speed = RocketProjectile.MIN_MAX_SPEED[0]
  }

  shoot(): void {
    const spritesheet =
      Assets.get<Spritesheet>("mainship_weapons_projectile_rockets")
    this.setupFromSheet(spritesheet)
    this.go = true
    this.startCount()
  }

  updateSpeed(): void {
    this.speed = MathUtils.add(
      this.speed,
      new Point(Math.pow(0.16, 2), Math.pow(0.16, 2)),
      RocketProjectile.MIN_MAX_SPEED
    )
  }

  onUpdate(delta: number): void {
    if (!this.go) return
    const dir = this.velocity.normalize()
    this.look(dir.multiply(new Point(100, 100)))
    this.updateSpeed()
    this.move(
      this.velocity.x * this.speed.x * delta,
      this.velocity.y * this.speed.y * delta
    )
  }
}

export class ZapperProjectile extends Projectile {
  length: number

  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    await super.onStart(context, ...args)
    return void context
  }

  addZapper(sheet: Spritesheet, num: number, position: Point) {
    this.animations = sheet.animations as ProjectileAnimations
    const frames = FrameObjects.from(this.animations.shoot)
    const sprite = this.addAnimatedSprite(frames, "AnimatedSprite" + num)
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.position.set(position.x, position.y)
    sprite.play()
  }

  shoot(): void {
    this.removeChildByName("AnimatedSprite")
    const spritesheet =
      Assets.get<Spritesheet>("mainship_weapons_projectile_zapper")
    this.length = 32
    for (let i = 0; i < this.length; i++)
      this.addZapper(spritesheet, i, new Point(0, i * -32))
    this.startCount()
  }

  onUpdate(): void {
    const dir = this.velocity.normalize()
    this.look(dir.multiply(new Point(100, 100)))
  }
}

export class BigGunProjectile extends Projectile {
  speed: Point
  private go: boolean
  private static MIN_MAX_SPEED: [Point, Point] = [
    new Point(0.98, 0.98),
    new Point(3, 3)
  ]

  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    await super.onStart(context, ...args)
    this.speed = BigGunProjectile.MIN_MAX_SPEED[1]
    this.go = false
    return void context
  }

  shoot(): void {
    const spritesheet =
      Assets.get<Spritesheet>("mainship_weapons_projectile_big_gun")
    this.setupFromSheet(spritesheet)
    this.go = true
    this.countdown = 10000
    this.startCount()
  }

  updateSpeed(): void {
    this.speed = MathUtils.add(
      this.speed,
      new Point(-0.06, -0.06),
      BigGunProjectile.MIN_MAX_SPEED
    )
  }

  onUpdate(delta: number): void {
    if (!this.go) return
    this.updateSpeed()
    this.move(
      this.velocity.x * this.speed.x * delta,
      this.velocity.y * this.speed.y * delta
    )
  }
}

export class KlaEdBullet extends Projectile {
  speed: Point
  private go: boolean
  private static MIN_MAX_SPEED: [Point, Point] = [
    new Point(0.98, 0.98),
    new Point(3, 3)
  ]

  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    await super.onStart(context, ...args)
    this.speed = new Point(1, 1)
    this.spritesheet =  Assets.get<Spritesheet>("klaed_bullet")
  }

  shoot(): void {
    this.setupFromSheet(this.spritesheet)
    this.go = true
    this.countdown = 6000
    this.startCount()
  }

  updateSpeed(): void {
    this.speed = MathUtils.add(
      this.speed,
      new Point(-0.06, -0.06),
      KlaEdBullet.MIN_MAX_SPEED
    )
  }

  onUpdate(delta: number): void {
    if (!this.go) return
    this.updateSpeed()
    this.look(this.velocity.normalize().multiply(new Point(100, 100)))
    this.move(
      this.velocity.x * this.speed.x * delta,
      this.velocity.y * this.speed.y * delta
      )
  }
}

export class KlaEdBigBullet extends KlaEdBullet {
  speed: Point
  async onStart(
    context: Context<AppEvents>,
    ...args: unknown[]
  ): Promise<void> {
    await super.onStart(context, ...args)
    this.speed = new Point(1, 1)
    this.spritesheet = Assets.get<Spritesheet>("klaed_big_bullet")
  }
}
