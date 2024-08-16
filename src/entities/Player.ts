import { EventNamesEnum } from "app/enums"
import { isDestructible } from "app/is"
import { Context, InputSingleton, Timer } from "core"
import { AbstractCollision } from "core/Collision"
import createSmallExplosion from "vfx/smallExplosion"
import MainShip, { MainShipAutoCannonWeapon } from "./MainShip"
import {
  SpaceShipBase,
  SpaceShipDestroied,
  SpaceShipEngine,
  SpaceShipFullHealth,
  SpaceShipSpawning
} from "./SpaceShip"

export default class Player extends MainShip {
  private debouncedVelocity = new Timer()
  private debouncedInput = new Timer()

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)
    this.position.set(0, 0)
    this.speed.set(1.0, 1.0)
    this.weapon = new MainShipAutoCannonWeapon(this, ctx)
    this.blink()
  }

  private blink() {
    const sprite = this.getChildByName("BaseSpaceShip")

    const interval = new Timer()
    const timeout = new Timer()

    interval.interval(() => {
      if (sprite) sprite.alpha = sprite.alpha ? 0 : 1
    }, 250)

    timeout.timeout(() => {
      interval.stop()
      this.baseState = new SpaceShipFullHealth(this)
      this.spaceShipEngine = new SpaceShipEngine(this, this.context)
      this.spaceShipEngine.powerOff()
      this.weapon?.equip()
      this.collision.enable()
    }, 2000)
  }

  onUpdate(delta: number): void {
    if (this instanceof SpaceShipDestroied) return

    if (this.velocity.y >= 0) this.velocity.y -= this.friction.y
    if (this.velocity.y <= 0) this.velocity.y += this.friction.y
    if (this.velocity.x >= 0) this.velocity.x -= this.friction.x
    if (this.velocity.x <= 0) this.velocity.x += this.friction.x

    if (InputSingleton.pressed) this.debouncedVelocity.debounce(
      () => this.velocity.set(0, 0), 1000
    )

    const canMove = !(this.baseState instanceof SpaceShipSpawning)

    this.weapon?.fire()

    if (canMove && InputSingleton.isKeyPressed("w")) {
      this.velocity.y = -this.speed.y
    }

    if (canMove && InputSingleton.isKeyPressed("s")) {
      this.velocity.y = this.speed.y
    }

    if (canMove && InputSingleton.isKeyPressed("d")) {
      this.velocity.x = this.speed.x
    }

    if (canMove && InputSingleton.isKeyPressed("a")) {
      this.velocity.x = -this.speed.x
    }

    if (this.spaceShipEngine) {
      if (
        InputSingleton.isKeyPressed("w", "d", "a") &&
        !this.spaceShipEngine.isPowerOn
      ) {
        this.spaceShipEngine.powerOn()
      }

      if (InputSingleton.isKeyReleased("w", "d", "a")) {
        this.debouncedInput.debounce(
          () => this.spaceShipEngine?.powerOff(),
          1000
        )
      }
    }

    const anchor = this.context.bounds.anchor

    if (
      this.position.x + 16 >= this.context.bounds.width * anchor.x) {
      this.position.x = this.context.bounds.x + 32
    }

    if (this.position.x - 16 <= -(this.context.bounds.width * anchor.x)) {
      this.position.x = this.context.bounds.width * anchor.x - 32
    }

    if (this.position.y + 16 >= this.context.bounds.height * anchor.y) {
      this.position.y = this.context.bounds.y + 32
    }

    if (this.position.y - 16 <= -(this.context.bounds.height / 2)) {
      this.position.y = this.context.bounds.height * anchor.y - 32
    }

    this.move(
      this.velocity.x * delta,
      this.velocity.y * delta,
    )
  }

  onChangeState(state: SpaceShipBase): void {
    super.onChangeState(state)
    if (state instanceof SpaceShipSpawning) {
      console.log("spawn")
    }
    if (state instanceof SpaceShipDestroied) {
      this.position.set(0, 0)
      this.speed.set(0, 0)
      this.health = 0
      this.weapon?.unequip()
      this.spaceShipEngine?.powerOff()
      this.context.emitter.emit(EventNamesEnum.GAME_OVER)
    }
  }

  onEnterBody(collision: AbstractCollision) {
    if (isDestructible(collision.parent)) {
      const destruction = createSmallExplosion()
      destruction.pos.x = this.position.x
      destruction.pos.y = this.position.y
      this.context.emitter.emit(EventNamesEnum.DISPATCH_VFX, destruction)
    }
  }

  onCollide(_: AbstractCollision) {
    // code...
  }

  onExitBody(_: AbstractCollision) {
    // code...
  }
}
