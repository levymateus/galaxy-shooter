import { AbstractGameObject, Textures } from "core"
import { Assets, Spritesheet } from "pixi.js"
import { Pickable } from "typings"

export class Pickup extends AbstractGameObject implements Pickable {
  addAnimatedSprite(textures: Textures, name: string) {
    const sprite = super.addAnimatedSprite(textures, name)
    sprite.animationSpeed = 0.4
    sprite.anchor.set(0.5)
    sprite.play()
    return sprite
  }

  equip(_?: number): void {
    throw new Error("Method not implemented.")
  }

  unequip(): void {
    throw new Error("Method not implemented.")
  }
}

export class PickupBaseEngine extends Pickup {
  async onStart(): Promise<void> {
    const spritesheet = Assets.get<Spritesheet>("pickup_icon_base_engine")
    const animations = spritesheet.animations as Record<"animation", Textures>
    this.addAnimatedSprite(animations.animation, "PickupBaseEngine")
  }
}
