import dataJson from "assets/sprites/enviroment/starry_background.json"
import { Context, Rectangle } from "core"
import { AnimatedSprite, Assets, Graphics, Spritesheet } from "pixi.js"
import { AppEvents } from "typings"
import { Activity } from "ui/typings"
import { randf } from "utils/utils"

/**
 * Scene background root node.
 */
export default class ParallaxStarryBackground implements Activity<AppEvents>  {
  context: Context<AppEvents>
  private sprites: AnimatedSprite[]

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    this.context = ctx
    this.sprites = []

    Assets.cache.set("starry_background", dataJson)

    const rect = new Rectangle(0, 0, ctx.width, ctx.height)
    const gr = new Graphics()
      .beginFill(0x2e222f, 1)
      .drawRect(rect.x, rect.y, rect.width, rect.height)
      .endFill()
    ctx.addChild(gr)

    this.addSprite(
      "shadows",
      "starry_background_layer_02_shadows",
      { x: 0, y: 0, speed: 0 }
    )

    this.addSprite(
      "shadows_02",
      "starry_background_layer_02_shadows_02",
      { x: 0, y: 0, speed: 1 }
    )

    this.addSprite(
      "shadows_02_copy",
      "starry_background_layer_02_shadows_02",
      { x: 0, y: -rect.height, speed: 1 }
    )

    this.addSprite(
      "shadows_03",
      "starry_background_layer_02_shadows_03",
      { x: 0, y: 0, speed: 0.4 }
    )

    this.addSprite(
      "shadows_03_copy",
      "starry_background_layer_02_shadows_03",
      { x: 0, y: -rect.height, speed: 0.4 }
    )

    this.addSprite(
      "stars",
      "starry_background_layer_03_stars",
      { x: 0, y: 0, speed: 0.5 }
    )

    this.addSprite(
      "stars_copy",
      "starry_background_layer_03_stars",
      { x: 0, y: -rect.height, speed: 0.5 }
    )

    this.addSprite(
      "starry_background_layer_x_big_star",
      "starry_background_layer_x_big_star",
      { x: randf(0, rect.width), y: 0, speed: 0.3 }
    )

    this.addSprite(
      "starry_background_layer_x_big_star_02",
      "starry_background_layer_x_big_star_02",
      { x: randf(0, rect.width), y: -rect.height, speed: 0.3 }
    )

    this.addSprite(
      "starry_background_layer_x_black_hole",
      "starry_background_layer_x_black_hole",
      { x: randf(0, rect.width), y: -rect.height * 2, speed: 0.3 }
    )

    this.addSprite(
      "starry_background_layer_x_rotary_star",
      "starry_background_layer_x_rotary_star",
      { x: randf(0, rect.width), y: -rect.height * 3, speed: 0.3 }
    )

    this.addSprite(
      "starry_background_layer_x_rotary_star_02",
      "starry_background_layer_x_rotary_star_02",
      { x: randf(0, rect.width), y: -rect.height * 4, speed: 0.3 }
    )
  }

  onUpdate(): void {
    // const initialPosition = new Point();
    // animatedSprite.y += dt * 1;
    // if (animatedSprite.y >= this.rect.height) {
    //   animatedSprite.position.set(initialPosition.x, initialPosition.y - this.rect.height);
    // }
  }


  async onFinish(): Promise<void> {
    // throw new Error("Method not implemented.");
  }

  // this function reuse an atlas data animation json file for multiple spritesheets.
  private parseFrom(prefix: string, bundleName: string, atlasDataKey: string) {
    const data = Assets.get(atlasDataKey)
    const frames: Record<string, unknown> = {}
    const animation: string[] = []
    Object.values(data.frames).forEach((value, index) => {
      const key = `${prefix}_${bundleName}_${index}`
      frames[key] = value
      animation.push(key)
    })
    data.frames = frames
    data.animations.animation = animation
    return data
  }

  private async addSprite(name: string, bundleName: string, props = {
    x: 0, y: 0, speed: 1
  }) {
    const data = this.parseFrom(name, bundleName, "starry_background")
    const texture = Assets.get(bundleName)
    const spritesheet = new Spritesheet(texture, data)
    await spritesheet.parse()
    const textures = spritesheet.animations['animation']
    if (!textures) throw new Error('Failded to load textures.')
    const sprite = new AnimatedSprite(textures)
    sprite.animationSpeed = 0.4
    sprite.position.set(props.x, props.y)
    sprite.anchor.set(0.5)
    sprite.name = name
    sprite.angle = 270
    sprite.play()
    this.context.addChild(sprite)
    this.sprites.push(sprite)
  }
}
