import { Context, GameObject } from "core"
import { AnimatedSprite, Assets, Point, Resource, Sprite, SpriteSource, Spritesheet, Texture } from "pixi.js"
import { AppEvents } from "typings"
import { angleBetween } from "utils/utils"

export interface ISpaceShipBase {
  damage(value: number): void
  heal(value: number): void
}

export class SpaceShipFullHealth implements ISpaceShipBase {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
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
    const sprite = this.spaceShipEngine.addAnimatedSprite(animations.powering, "SpaceShipEngine")
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
    const sprite = this.spaceShipEngine.addAnimatedSprite(animations.idle, "SpaceShipEngine")
    sprite.loop = true
    sprite.zIndex = -1
    sprite.play()
  }
}

/**
 * Mainship base engine.
 */
export class SpaceShipEngine extends GameObject<AppEvents> implements ISpaceShipEngine {
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
    this.removeSprite("SpaceShipBaseEngine")
    const engineSource = Assets.get<SpriteSource>("mainship_base_engine")
    const engineSprite = this.addSprite(engineSource, "SpaceShipBaseEngine")
    engineSprite.zIndex = -1
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
    return this.parent.removeChildByName(name)
  }

  addSprite(source: SpriteSource, name: string): Sprite {
    return this.parent.addSprite(source, name)
  }

  addAnimatedSprite(textures: Texture<Resource>[], name: string): AnimatedSprite {
    return this.parent.addAnimatedSprite(textures, name)
  }
}

export default class SpaceShip extends GameObject<AppEvents> implements ISpaceShipBase {
  health: number
  maxHealth: number
  baseState: ISpaceShipBase
  spaceShipEngine: SpaceShipEngine | null
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
    this.spaceShipEngine = null
    return void ctx
  }

  look(to: Point) {
    if (this.position.x && this.position.y)
      this.angle = angleBetween(
        this.position.normalize(),
        to.normalize().multiply(new Point(2, 2))
      ) - 270
  }

  move(x: number, y: number) {
    this.position.x += x
    this.position.y += y
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
    this.removeChildByName(name)
    const sprite = super.addSprite(source, name)
    sprite.anchor.set(0.5)
    return sprite
  }

  addAnimatedSprite(textures: Texture<Resource>[], name: string) {
    this.removeChildByName(name)
    const sprite = super.addAnimatedSprite(textures, name)
    sprite.animationSpeed = 0.4
    sprite.anchor.set(0.5)
    return sprite
  }
}
