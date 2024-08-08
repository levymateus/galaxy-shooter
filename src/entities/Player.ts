import { EventNamesEnum } from "app/enums"
import { Context, InputSingleton, Timer } from "core"
import { AbstractCollision } from "core/Collision"
import createSmallExplosion from "vfx/smallExplosion"
import MainShip from "./MainShip"
import {
  SpaceShipBase,
  SpaceShipEngine,
  SpaceShipFullHealth,
  SpaceShipSpawning
} from "./SpaceShip"

export default class Player extends MainShip {
  private debouncedVelocity = new Timer()
  private debouncedInput = new Timer()
  private blinkTimer = new Timer()

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)
    this.position.set(0, 0)
    this.speed.set(1.0, 1.0)
    this.blink()
  }

  private blink() {
    this.blinkTimer.interval(() => {
      const sprite = this.getChildByName("BaseSpaceShip")
      if (sprite) sprite.alpha = sprite.alpha ? 0 : 1
    }, 250)

    this.blinkTimer.timeout(() => {
      this.blinkTimer.stop()
      this.baseState = new SpaceShipFullHealth(this)
      this.spaceShipEngine = new SpaceShipEngine(this, this.context)
      this.spaceShipEngine.powerOff()
      this.collision.enable()
    }, 1000)
  }

  onUpdate(delta: number): void {
    if (this.velocity.y >= 0) this.velocity.y -= this.friction.y
    if (this.velocity.y <= 0) this.velocity.y += this.friction.y
    if (this.velocity.x >= 0) this.velocity.x -= this.friction.x
    if (this.velocity.x <= 0) this.velocity.x += this.friction.x

    if (InputSingleton.pressed) this.debouncedVelocity.debounce(
      () => this.velocity.set(0, 0), 1000
    )

    const canMove = !(this.baseState instanceof SpaceShipSpawning)

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
  }

  onEnterBody(_: AbstractCollision) {
    const destruction = createSmallExplosion()
    destruction.pos.x = this.position.x
    destruction.pos.y = this.position.y
    this.context.emitter.emit(EventNamesEnum.DISPATCH_VFX, destruction)
  }

  onCollide(_: AbstractCollision) {
    // code...
  }

  onExitBody(_: AbstractCollision) {
    // code...
  }
}
