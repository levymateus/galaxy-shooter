import { Context, GameObject } from "core"
import { AnimatedSprite, Assets, Point, Resource, Sprite, SpriteSource, Spritesheet, Texture } from "pixi.js"
import { AppEvents } from "typings"
import { angleBetween } from "utils/utils"

export interface ISpaceShip {
  removeSprite(name: string): void
  addSprite(source: SpriteSource, name: string): Sprite
  addAnimatedSprite(textures: Texture<Resource>[], name: string): AnimatedSprite
}

export interface ISpaceShipBase {
  damage(value: number): void
  heal(value: number): void
}

export class SpaceShipFullHealth implements ISpaceShipBase {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.removeSprite("BaseSpaceShip")
    this.spaceShip.addSprite(this.spaceShip.spriteSrcs.health, "BaseSpaceShip")
    this.damage(0)
  }

  damage(value: number): void {
    this.spaceShip.health -= value
    if (
      this.spaceShip.health < this.spaceShip.maxHealth
    ) {
      this.spaceShip.changeState(new SpaceShipFullSlightDamaged(this.spaceShip))
    }
  }

  heal(value: number): void {
    this.spaceShip.health += value
    if (this.spaceShip.health > this.spaceShip.maxHealth) {
      this.spaceShip.health = this.spaceShip.maxHealth
    }
  }
}

export class SpaceShipFullSlightDamaged implements ISpaceShipBase {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.removeSprite("BaseSpaceShip")
    this.spaceShip.addSprite(this.spaceShip.spriteSrcs.slight_damaged, "BaseSpaceShip")
    this.damage(0)
  }

  damage(value: number): void {
    this.spaceShip.health -= value
    if (
      this.spaceShip.health < this.spaceShip.maxHealth * 0.75
    ) {
      this.spaceShip.changeState(new SpaceShipDamaged(this.spaceShip))
    }
  }

  heal(value: number): void {
    this.spaceShip.health += value
    if (
      this.spaceShip.health > this.spaceShip.maxHealth * 0.75
    ) {
      this.spaceShip.changeState(new SpaceShipFullSlightDamaged(this.spaceShip))
    }
  }
}

export class SpaceShipDamaged implements ISpaceShipBase {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.removeSprite("BaseSpaceShip")
    this.spaceShip.addSprite(this.spaceShip.spriteSrcs.damaged, "BaseSpaceShip")
    this.damage(0)
  }

  damage(value: number): void {
    this.spaceShip.health -= value
    if (
      this.spaceShip.health < this.spaceShip.maxHealth * 0.5
    ) {
      this.spaceShip.changeState(new SpaceShipVeryDamaged(this.spaceShip))
    }
  }

  heal(value: number): void {
    this.spaceShip.health += value
    if (
      this.spaceShip.health > this.spaceShip.maxHealth * 0.5
    ) {
      this.spaceShip.changeState(new SpaceShipDamaged(this.spaceShip))
    }
  }
}

export class SpaceShipVeryDamaged implements ISpaceShipBase {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.removeSprite("BaseSpaceShip")
    this.spaceShip.addSprite(this.spaceShip.spriteSrcs.very_damaged, "BaseSpaceShip")
    this.damage(0)
  }

  damage(value: number): void {
    this.spaceShip.health -= value
    if (this.spaceShip.health <= 0) {
      this.spaceShip.visible = false
    }
    if (this.spaceShip.health < 0) {
      this.spaceShip.health = 0
    }
  }

  heal(value: number): void {
    this.spaceShip.health += value
    if (
      this.spaceShip.health > 0
    ) {
      this.spaceShip.changeState(new SpaceShipVeryDamaged(this.spaceShip))
    }
  }
}

export interface ISpaceShipEngine {
  powerOn(): void
  powerOff(): void
}

export class SpaceShipEnginePower implements ISpaceShipEngine {
  spaceShipEngine: SpaceShipEngine

  constructor(spaceShipEngine: SpaceShipEngine) {
    this.spaceShipEngine = spaceShipEngine
    this.powerOn()
  }

  powerOn(): void {
    const spritesheet = this.spaceShipEngine.spritesheets.engine_power
    const animations = spritesheet.animations as Record<"powering", Texture<Resource>[]>
    this.spaceShipEngine.removeSprite("SpaceShipEngine")
    const sprite = this.spaceShipEngine.addAnimatedSprite(animations.powering, "SpaceShipEngine")
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.loop = true
    sprite.zIndex = -1
    sprite.play()
  }

  powerOff(): void {
    this.spaceShipEngine.changeState(new SpaceShipEngineIdle(this.spaceShipEngine))
  }
}

export class SpaceShipEngineIdle implements ISpaceShipEngine {
  spaceShipEngine: SpaceShipEngine

  constructor(spaceShipEngine: SpaceShipEngine) {
    this.spaceShipEngine = spaceShipEngine
    this.powerOff()
  }

  powerOn(): void {
    this.spaceShipEngine.changeState(new SpaceShipEnginePower(this.spaceShipEngine))
  }

  powerOff(): void {
    const spritesheet = this.spaceShipEngine.spritesheets.engine_idle
    const animations = spritesheet.animations as Record<"idle", Texture<Resource>[]>
    this.spaceShipEngine.removeSprite("SpaceShipEngine")
    const sprite = this.spaceShipEngine.addAnimatedSprite(animations.idle, "SpaceShipEngine")
    sprite.anchor.set(0.5)
    sprite.animationSpeed = 0.4
    sprite.loop = true
    sprite.zIndex = -1
    sprite.play()
  }
}

export class SpaceShipEngine extends GameObject<AppEvents> implements ISpaceShip, ISpaceShipEngine {
  state: ISpaceShipEngine
  parent: SpaceShip
  spritesheets: Record<"engine_power" | "engine_idle", Spritesheet>

  constructor(parent: SpaceShip, ctx: Context<AppEvents>) {
    super(ctx, "SpaceShipEngine")
    this.parent = parent
    this.spritesheets = {
      engine_power: Assets.get<Spritesheet>("mainship_base_engine_powering"),
      engine_idle: Assets.get<Spritesheet>("mainship_base_engine_idle")
    }
    this.state = new SpaceShipEngineIdle(this)
  }

  changeState(state: ISpaceShipEngine) {
    this.state = state
  }

  powerOn(): void {
    this.state.powerOn()
  }

  powerOff(): void {
    this.state.powerOff()
  }

  removeSprite(name: string): void {
    return this.parent.removeSprite(name)
  }

  addSprite(source: SpriteSource, name: string): Sprite {
    return this.parent.addSprite(source, name)
  }

  addAnimatedSprite(textures: Texture<Resource>[], name: string): AnimatedSprite {
    return this.parent.addAnimatedSprite(textures, name)
  }
}

export default class SpaceShip extends GameObject<AppEvents> implements ISpaceShip, ISpaceShipBase {
  health: number
  maxHealth: number
  baseState: ISpaceShipBase
  spaceShipEngine: SpaceShipEngine
  spriteSrcs: Record<"health" | "slight_damaged" | "very_damaged" | "damaged", SpriteSource>

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    this.sortableChildren = true
    this.health = 100
    this.maxHealth = 100
    this.spriteSrcs = {
      health: Assets.get("mainship_base_full_health"),
      damaged: Assets.get("mainship_base_slight_damaged"),
      slight_damaged: Assets.get("mainship_base_slight_damaged"),
      very_damaged: Assets.get("mainship_base_very_damaged"),
    }
    this.baseState = new SpaceShipFullHealth(this)
    this.spaceShipEngine = new SpaceShipEngine(this, ctx)
  }

  move(velocity: Point) {
    this.angle = angleBetween(
      this.position.normalize(),
      velocity.normalize().multiply(new Point(2, 2))
    ) - 270
    this.position.x += velocity.x
    this.position.y += velocity.y
  }

  changeState(state: ISpaceShipBase) {
    this.baseState = state
  }

  damage(value: number): void {
    this.baseState.damage(value)
  }

  heal(value: number): void {
    this.baseState.heal(value)
  }

  addSprite(source: SpriteSource, name: string) {
    const sprite = Sprite.from(source)
    sprite.name = name
    sprite.anchor.set(0.5)
    this.addChild(sprite)
    return sprite
  }

  removeSprite(name: string) {
    const prevSprite = this.getChildByName(name)
    if (prevSprite) this.removeChild(prevSprite)
  }

  addAnimatedSprite(textures: Texture<Resource>[], name: string) {
    const sprite = new AnimatedSprite(textures)
    sprite.name = name
    sprite.anchor.set(0.5)
    this.addChild(sprite)
    return sprite
  }
}
