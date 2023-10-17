import { GameObject } from "core"
import { Assets, Sprite, SpriteSource } from "pixi.js"
import { AppEvents } from "typings"

interface ISpaceShipBase {
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
      this.spaceShip.changeBaseState(new SpaceShipFullSlightDamaged(this.spaceShip))
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
      this.spaceShip.changeBaseState(new SpaceShipDamaged(this.spaceShip))
    }
  }

  heal(value: number): void {
    this.spaceShip.health += value
    if (
      this.spaceShip.health > this.spaceShip.maxHealth * 0.75
    ) {
      this.spaceShip.changeBaseState(new SpaceShipFullSlightDamaged(this.spaceShip))
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
      this.spaceShip.changeBaseState(new SpaceShipVeryDamaged(this.spaceShip))
    }
  }

  heal(value: number): void {
    this.spaceShip.health += value
    if (
      this.spaceShip.health > this.spaceShip.maxHealth * 0.5
    ) {
      this.spaceShip.changeBaseState(new SpaceShipDamaged(this.spaceShip))
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
      this.spaceShip.changeBaseState(new SpaceShipVeryDamaged(this.spaceShip))
    }
  }
}

interface ISpaceShipEngine {
  powerOn(): void
  powerOff(): void
}

export class SpaceShipEnginePower implements ISpaceShipEngine {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
  }

  powerOn(): void {
    // nothing
  }

  powerOff(): void {
    this.spaceShip.changeEngineState(new SpaceShipEngineIdle(this.spaceShip))
  }
}

export class SpaceShipEngineIdle implements ISpaceShipEngine {
  spaceShip: SpaceShip

  constructor(spaceShip: SpaceShip) {
    this.spaceShip = spaceShip
  }

  powerOn(): void {
    this.spaceShip.changeEngineState(new SpaceShipEnginePower(this.spaceShip))
  }

  powerOff(): void {
    // nothing
  }
}

export default class SpaceShip extends GameObject<AppEvents> implements ISpaceShipBase, ISpaceShipEngine {
  health: number
  maxHealth: number
  spaceShipBase: ISpaceShipBase
  spaceEngine: ISpaceShipEngine
  spriteSrcs: Record<"health" | "slight_damaged" | "very_damaged" | "damaged" | "engine_power" | "engine_idle", SpriteSource>

  async onStart(): Promise<void> {
    this.health = 100
    this.maxHealth = 100
    const defaultSrc = Assets.get("mainship_base_full_health")
    this.spriteSrcs = {
      health: defaultSrc,
      damaged: defaultSrc,
      slight_damaged: defaultSrc,
      very_damaged: defaultSrc,
      engine_power: defaultSrc,
      engine_idle: defaultSrc
    }
    this.spaceShipBase = new SpaceShipFullHealth(this)
  }

  changeBaseState(state: ISpaceShipBase) {
    this.spaceShipBase = state
  }

  changeEngineState(state: ISpaceShipEngine) {
    this.spaceEngine = state
  }

  damage(value: number): void {
    this.spaceShipBase.damage(value)
  }

  heal(value: number): void {
    this.spaceShipBase.heal(value)
  }

  powerOn(): void {

  }

  powerOff(): void {

  }

  addSprite(source: SpriteSource, name: string) {
    const sprite = Sprite.from(source)
    sprite.name = name
    sprite.anchor.set(0.5)
    this.addChild(sprite)
  }

  removeSprite(name: string) {
    const prevSprite = this.getChildByName(name)
    if (prevSprite) this.removeChild(prevSprite)
  }

  addAnimatedSprite() {

  }
}
