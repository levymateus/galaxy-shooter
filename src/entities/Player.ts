import { EventNamesEnum } from "app/enums"
import { Context, Input, Timer } from "core"
import { AbstractCollision } from "core/Collision"
import { InputActionsEnum } from "core/enums"
import createSmallExplosion from "vfx/smallExplosion"
import MainShip, { MainShipAutoCannonWeapon } from "./MainShip"
import {
  SpaceShipBase,
  SpaceShipFullHealth,
  SpaceShipSpawning
} from "./SpaceShip"

export default class Player extends MainShip {
  private debounce: Timer

  async onStart(ctx: Context): Promise<void> {
    await super.onStart(ctx)
    this.debounce = new Timer()
    this.position.set(0, 0)
    this.speed.set(2, 2)
    this.blink()
  }

  private blink() {
    const blinkTimer = new Timer()

    blinkTimer.interval(() => {
      const sprite = this.getChildByName("BaseSpaceShip")
      if (sprite) sprite.alpha = sprite.alpha ? 0 : 1
    }, 250)

    new Timer().timeout(() => {
      blinkTimer.stop()
      this.baseState = new SpaceShipFullHealth(this)
      this.collision.enable()
    }, 1000)
  }

  onUpdate(delta: number): void {
    if (this.velocity.y >= 0) this.velocity.y -= this.friction.y
    if (this.velocity.y <= 0) this.velocity.y += this.friction.y
    if (this.velocity.x >= 0) this.velocity.x -= this.friction.x
    if (this.velocity.x <= 0) this.velocity.x += this.friction.x

    if (Input.pressed) this.debounce.debounce(
      () => this.velocity.set(0, 0), 500
    )

    const canMove = !(this.baseState instanceof SpaceShipSpawning)

    if (canMove && Input.isActionPressed(InputActionsEnum.MOVE_UP))
      this.velocity.y = -this.speed.y
    if (canMove && Input.isActionPressed(InputActionsEnum.MOVE_RIGHT))
      this.velocity.x = this.speed.x
    if (canMove && Input.isActionPressed(InputActionsEnum.MOVE_LEFT))
      this.velocity.x = -this.speed.x
    if (canMove && Input.isActionPressed(InputActionsEnum.MOVE_DOWN))
      this.velocity.y = this.speed.y

    if (this.weapon instanceof MainShipAutoCannonWeapon) this.weapon.fire()
    else if (Input.isActionPressed(InputActionsEnum.WEAPON_FIRE)) this.weapon?.fire()

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
