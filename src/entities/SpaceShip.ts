import { Context, GameObject, Textures } from "core"
import {
  AnimatedSprite,
  Assets,
  FrameObject,
  Point,
  Sprite,
  SpriteSource,
  Spritesheet
} from "pixi.js"

export interface ISpaceShipBase {
  damage(value: number): void
  heal(value: number): void
}

export class SpaceShipFullHealth implements ISpaceShipBase {
  constructor(public readonly spaceShip: SpaceShip) {
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
 constructor(public readonly spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.addSprite(
      this.spaceShip.spriteSrcs.slight_damaged, "BaseSpaceShip"
    )
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
constructor(public readonly spaceShip: SpaceShip) {
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
  constructor(public readonly spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.addSprite(
      this.spaceShip.spriteSrcs.very_damaged, "BaseSpaceShip"
    )
    this.damage(0)
  }

  damage(value: number): void {
    this.spaceShip.health -= value
    if (this.spaceShip.health <= 0) {
      this.spaceShip.changeState(new SpaceShipDestroied(this.spaceShip))
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

export class SpaceShipDestroied implements ISpaceShipBase {
  constructor(public readonly spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.damage(0)
  }

  damage(value: number): void {
    if (this.spaceShip.health < 0) {
      this.spaceShip.health = 0
    }
    return void value
  }

  heal(value: number): void {
    this.spaceShip.health = 0
    return void value
  }
}

export interface ISpaceShipEngine {
  powerOn(): void
  powerOff(): void
}

export class SpaceShipEnginePower implements ISpaceShipEngine {
  constructor(public readonly spaceShipEngine: SpaceShipEngine) {
    this.spaceShipEngine = spaceShipEngine
    this.powerOn()
  }

  powerOn(): void {
    const spritesheet = this.spaceShipEngine.spritesheets.engine_power
    const animations = spritesheet.animations as Record<"powering", Textures>
    const sprite = this.spaceShipEngine.addAnimatedSprite(
      animations.powering, "SpaceShipEngine"
    )
    sprite.loop = true
    sprite.zIndex = -1
    sprite.play()
  }

  powerOff(): void {
    this.spaceShipEngine.changeState(
      new SpaceShipEngineIdle(this.spaceShipEngine)
    )
  }
}

export class SpaceShipEngineIdle implements ISpaceShipEngine {
  constructor(public readonly spaceShipEngine: SpaceShipEngine) {
    this.spaceShipEngine = spaceShipEngine
    this.powerOff()
  }

  powerOn(): void {
    this.spaceShipEngine.changeState(
      new SpaceShipEnginePower(this.spaceShipEngine)
    )
  }

  powerOff(): void {
    const spritesheet = this.spaceShipEngine.spritesheets.engine_idle
    const animations = spritesheet.animations as Record<"idle", Textures>
    const sprite = this.spaceShipEngine.addAnimatedSprite(
      animations.idle, "SpaceShipEngine"
    )
    sprite.loop = true
    sprite.zIndex = -1
    sprite.play()
  }
}

export class SpaceShipSpawning implements ISpaceShipBase {
  constructor(public readonly spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
    this.spaceShip.addSprite(this.spaceShip.spriteSrcs.health, "BaseSpaceShip")
    this.damage(0)
  }

  damage(value: number): void {
    return void value
  }

  heal(value: number): void {
    return void value
  }
}

/**
 * Mainship base engine.
 */
export class SpaceShipEngine
  extends GameObject
  implements ISpaceShipEngine {
  static CANONICAL_NAME = "SpaceShipBaseEngine"
  state: ISpaceShipEngine
  spritesheets: Record<"engine_power" | "engine_idle", Spritesheet>

  constructor(
    public readonly parent: SpaceShip,
    ctx: Context
  ) {
    super(ctx, SpaceShipEngine.CANONICAL_NAME)
    this.parent = parent
    this.spritesheets = {
      engine_power: Assets.get<Spritesheet>("mainship_base_engine_powering"),
      engine_idle: Assets.get<Spritesheet>("mainship_base_engine_idle")
    }
    this.state = new SpaceShipEngineIdle(this)
    this.setupFromSrc(Assets.get<SpriteSource>("mainship_base_engine"))
  }

  setupFromSrc(spriteSrc: SpriteSource) {
    this.removeSprite(SpaceShipEngine.CANONICAL_NAME)
    const engineSprite = this.addSprite(
      spriteSrc, SpaceShipEngine.CANONICAL_NAME
    )
    engineSprite.zIndex = -1
  }

  initSpritesheets(sheet: Spritesheet) {
    this.spritesheets = {
      engine_power: sheet,
      engine_idle: sheet
    }
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

  addAnimatedSprite(textures: Textures, name: string): AnimatedSprite {
    return this.parent.addAnimatedSprite(textures, name)
  }
}

export default class SpaceShip
  extends GameObject
  implements ISpaceShipBase {
  health: number
  velocity: Point
  maxHealth: number
  baseState: ISpaceShipBase
  spaceShipEngine: SpaceShipEngine | null
  spriteSrcs: Record<
    "health" | "slight_damaged" | "very_damaged" | "damaged", SpriteSource
  >

  async onStart(ctx: Context): Promise<void> {
    this.sortableChildren = true
    this.health = 100
    this.maxHealth = 100
    this.spriteSrcs = {
      health: Assets.get("mainship_base_full_health"),
      damaged: Assets.get("mainship_base_slight_damaged"),
      slight_damaged: Assets.get("mainship_base_slight_damaged"),
      very_damaged: Assets.get("mainship_base_very_damaged"),
    }
    this.baseState = new SpaceShipSpawning(this)
    this.spaceShipEngine = null
    return void ctx
  }

  move(x: number, y: number) {
    this.position.x += x
    this.position.y += y
  }

  initSpriteSrcs(spriteSrc: SpriteSource): void {
    this.spriteSrcs = {
      health: spriteSrc,
      damaged: spriteSrc,
      slight_damaged: spriteSrc,
      very_damaged: spriteSrc
    }
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

  addAnimatedSprite(textures: Textures | FrameObject[], name: string) {
    this.removeChildByName(name)
    const sprite = super.addAnimatedSprite(textures, name)
    sprite.animationSpeed = 0.4
    sprite.anchor.set(0.5)
    return sprite
  }

  explodeAndDestroy(textures: Textures, name: string): void {
    this.removeChildren()
    const sprite = this.addAnimatedSprite(textures, name)
    sprite.onComplete = () => this.destroy({ children: true })
    sprite.loop = false
    sprite.animationSpeed = 0.4
    sprite.play()
  }
}
