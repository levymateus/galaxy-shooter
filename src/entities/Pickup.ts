import { GameObject } from "core"
import { Assets, Resource, Spritesheet, Texture } from "pixi.js"
import { AppEvents } from "typings"

type AnimationFrames = Texture<Resource>[]

export class Pickup extends GameObject<AppEvents> {
  addAnimatedSprite(frames: AnimationFrames, name: string) {
    const sprite = super.addAnimatedSprite(frames, name)
    sprite.animationSpeed = 0.4
    sprite.anchor.set(0.5)
    sprite.play()
    return sprite
  }
}

export class PickupBaseEngine extends Pickup {
  async onStart(): Promise<void> {
    const spritesheet = Assets.get<Spritesheet>("pickup_icon_base_engine")
    const animations = spritesheet.animations as Record<"animation", AnimationFrames>
    this.addAnimatedSprite(animations.animation, "PickupBaseEngine")
  }
}
