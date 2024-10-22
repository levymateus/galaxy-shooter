import { Context, InputSingleton, Timer } from "core"
import { AbstractCollision } from "core/Collision"
import { EventNamesEnum } from "typings/enums"
import { EventTypes } from "typings/typings"
import { isDestructible } from "utils/is"
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
  private canMove = false
  context: Context<EventTypes>

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)

    this.position.set(0, 0)
    this.speed.set(0.9, 0.9)
    this.weapon = new MainShipAutoCannonWeapon(this, ctx)

    this.canMove = false
    this.spawn().then(() => {
      this.canMove = true
    })
  }

  private async spawn() {
    this.weapon?.unequip()
    this.collision.disable()

    this.changeState(new SpaceShipSpawning(this))

    await this.blink()

    this.baseState = new SpaceShipFullHealth(this)
    this.spaceShipEngine = new SpaceShipEngine(this, this.context)

    this.weapon?.equip()
    this.collision.enable()
  }

  private async blink() {
    const sprite = this.getChildByName("BaseSpaceShip")

    const interval = new Timer()
    const timeout = new Timer()

    interval.interval(250, () => {
      if (sprite) sprite.alpha = sprite.alpha >= 1 ? 0.2 : 1
    })

    await timeout.wait(2000)

    interval.stop()
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

    const canMove = this.canMove

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
        !this.spaceShipEngine.power
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

    if (state instanceof SpaceShipDestroied) {
      this.position.set(0, 0)
      this.speed.set(0, 0)
      this.health = 0
      this.weapon?.unequip()
      this.spaceShipEngine?.powerOff()
      this.context.emitter.emit(EventNamesEnum.GOTO_GAME_OVER)
    }
  }

  onEnterBody(collision: AbstractCollision) {
    if (isDestructible(collision.parent)) {
      const destruction = createSmallExplosion()
      destruction.pos.x = this.position.x
      destruction.pos.y = this.position.y
      this.context.emitter.emit(EventNamesEnum.DISPATCH_VFX, destruction)
      collision.parent.takeDamage(100)
    }
  }

  onCollide(_: AbstractCollision) {
    // code...
  }

  onExitBody(_: AbstractCollision) {
    // code...
  }
}
