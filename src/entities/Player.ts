import { Actions, Context, Input, Timer } from "core"
import { AbstractCollision } from "core/Collision"
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

    const blinkTimer = new Timer()

    blinkTimer.interval(() => {
      const sprite = this.getChildByName("BaseSpaceShip")
      if (sprite) sprite.alpha = sprite.alpha ? 0 : 1
    }, 250)

    new Timer().timeout(() => {
      blinkTimer.stop()
      this.baseState = new SpaceShipFullHealth(this)
    }, 500)
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

    if (canMove && Input.isActionPressed(Actions.MOVE_UP))
      this.velocity.y = -this.speed.y
    if (canMove && Input.isActionPressed(Actions.MOVE_RIGHT))
      this.velocity.x = this.speed.x
    if (canMove && Input.isActionPressed(Actions.MOVE_LEFT))
      this.velocity.x = -this.speed.x
    if (canMove && Input.isActionPressed(Actions.MOVE_DOWN))
      this.velocity.y = this.speed.y

    if (this.weapon instanceof MainShipAutoCannonWeapon) this.weapon.fire()
    else if (Input.isActionPressed(Actions.WEAPON_FIRE)) this.weapon?.fire()

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

  onEnterBody(_: AbstractCollision): void {
    console.log('enter')
  }

  onExitBody(_: AbstractCollision): void {
    console.log('exit')
  }

  onCollide(_: AbstractCollision): void {
    // console.log(coll);
  }
}
