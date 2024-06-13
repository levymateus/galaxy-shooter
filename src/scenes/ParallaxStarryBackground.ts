import dataJson from "assets/sprites/enviroment/starry_background.json"
import { Activity, Context } from "core"
import {
  AnimatedSprite,
  Assets,
  Graphics,
  ISpritesheetData,
  Spritesheet
} from "pixi.js"
import { AppEvents, Vec2 } from "typings"
import { MathUtils } from "utils/utils"

type SpriteData = {
  sprite: AnimatedSprite,
  props: {
    pos: Vec2,
    speed: number
  }
}

/**
 * Scene background root node.
 */
export default class ParallaxStarryBackground implements Activity<AppEvents>  {
  context: Context<AppEvents>
  private sprites: SpriteData[]

  async onStart(ctx: Context<AppEvents>): Promise<void> {
    this.context = ctx
    this.context.anchor.set(-0.5)
    this.sprites = []

    Assets.cache.set("starry_background", dataJson)

    const rect = this.context.bounds
    const gr = new Graphics()
      .beginFill(0x2e222f, 1)
      .drawRect(rect.x, rect.y, rect.width, rect.height)
      .endFill()
    gr.name = "solid_color_background"
    ctx.addChild(gr)

    this.addSprite(
      "shadows",
      "starry_background_layer_02_shadows",
      {
        pos: { x: 0, y: 0 },
        speed: 0
      }
    )

    this.addSprite(
      "shadows_02",
      "starry_background_layer_02_shadows_02",
      {
        pos: { x: 0, y: 0 },
        speed: 1
      }
    )

    this.addSprite(
      "shadows_02_copy",
      "starry_background_layer_02_shadows_02",
      {
        pos: { x: 0, y: -rect.height },
        speed: 1
      }
    )

    this.addSprite(
      "shadows_03",
      "starry_background_layer_02_shadows_03",
      {
        pos: { x: 0, y: 0 },
        speed: 0.4
      }
    )

    this.addSprite(
      "shadows_03_copy",
      "starry_background_layer_02_shadows_03",
      {
        pos: { x: 0, y: -rect.height },
        speed: 0.4
      }
    )

    this.addSprite(
      "stars",
      "starry_background_layer_03_stars",
      {
        pos: { x: 0, y: 0 },
        speed: 0.5
      }
    )

    this.addSprite(
      "stars_copy",
      "starry_background_layer_03_stars",
      {
        pos: { x: 0, y: -rect.height },
        speed: 0.5
      }
    )

    this.addSprite(
      "starry_background_layer_x_big_star",
      "starry_background_layer_x_big_star",
      {
        pos: { x: MathUtils.randf(0, rect.width), y: 0 },
        speed: 0.3
      }
    )

    this.addSprite(
      "starry_background_layer_x_big_star_02",
      "starry_background_layer_x_big_star_02",
      {
        pos: { x: 0, y: -rect.height },
        speed: 0.3
      }
    )

    this.addSprite(
      "starry_background_layer_x_black_hole",
      "starry_background_layer_x_black_hole",
      {
        pos: { x: 0, y: -rect.height * 2 },
        speed: 0.3
      }
    )

    this.addSprite(
      "starry_background_layer_x_rotary_star",
      "starry_background_layer_x_rotary_star",
      {
        pos: { x: 0, y: -rect.height * 3 },
        speed: 0.3
      }
    )

    this.addSprite(
      "starry_background_layer_x_rotary_star_02",
      "starry_background_layer_x_rotary_star_02",
      {
        pos: { x: 0, y: -rect.height * 4 },
        speed: 0.3
      }
    )
  }

  onUpdate(dt: number): void {
    this.sprites.forEach(({ sprite, props }) => {
      sprite.y += dt * props.speed
      if (sprite.y >= this.context.bounds.height) {
        sprite.position.set(0, 0 - this.context.bounds.height)
      }
    })
  }


  async onFinish(): Promise<void> {
    this.context.visible = false
  }

  /**
   * This function reuse an atlas data animation json file for
   * multiple spritesheets.
   *
   * @param prefix - A string value for the prefix.
   * @param bundleName - A string bundle name value.
   * @param atlasDataKey - A string data key.
   * @returns A spritesheet data object.
   */
  private parseFrom(prefix: string, bundleName: string, atlasDataKey: string) {
    const data: ISpritesheetData = Assets.get(atlasDataKey)
    const frames: ISpritesheetData["frames"] = {}
    const animations: ISpritesheetData["animations"] = {}
    const animation: string[] = [];
    Object.values(data.frames).forEach((value, index) => {
      const key = [prefix, bundleName, index].join('_')
      frames[key] = value
      animation.push(key)
    })
    animations["animation"] = animation
    data.frames = frames
    data.animations = animations
    return data
  }

  private async addSprite(
    name: string,
    bundleName: string,
    props: SpriteData['props']
  ) {
    const data = this.parseFrom(name, bundleName, "starry_background")
    const texture = Assets.get(bundleName)
    const spritesheet = new Spritesheet(texture, data)
    await spritesheet.parse()
    const textures = spritesheet.animations['animation']
    if (!textures) throw new Error('Failded to load textures.')
    const sprite = new AnimatedSprite(textures)
    sprite.animationSpeed = 0.4
    sprite.position.set(props.pos.x, props.pos.y)
    sprite.anchor.set(0.5)
    sprite.name = name
    sprite.angle = 270
    sprite.play()
    this.context.addChild(sprite)
    this.sprites.push({ sprite, props })
  }
}
