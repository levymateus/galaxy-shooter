import dataJson from "assets/sprites/enviroment/starry_background.json";
import { GameObject, Rectangle } from "core";
import { Drawable } from "core/typings";
import { AnimatedSprite, Assets, Graphics, Point, Spritesheet } from "pixi.js";
import { randf } from "utils/utils";

/**
 * Scene background root node.
 */
export default class ParallaxStarryBackground extends GameObject implements Drawable {
  public color: number = 0x2e222f;
  public alpha: number = 1;
  private rect: Rectangle;

  constructor(rect: Rectangle) {
    super("background");
    this.rect = rect;
    this.rect.anchor.set(0.5);
    this.load();
    this.draw();
  }

  private async load() {
    Assets.cache.set("starry_background", dataJson);

    this.addSprite(
      "shadows",
      "starry_background_layer_02_shadows",
      { x: 0, y: 0, speed: 0 }
    );

    this.addSprite(
      "shadows_02",
      "starry_background_layer_02_shadows_02",
      { x: 0, y: 0, speed: 1 }
    );
    this.addSprite(
      "shadows_02_copy",
      "starry_background_layer_02_shadows_02",
      { x: 0, y: -this.rect.height, speed: 1 }
    );

    this.addSprite(
      "shadows_03",
      "starry_background_layer_02_shadows_03",
      { x: 0, y: 0, speed: 0.4 }
    );
    this.addSprite(
      "shadows_03_copy",
      "starry_background_layer_02_shadows_03",
      { x: 0, y: -this.rect.height, speed: 0.4 }
    );

    this.addSprite(
      "stars",
      "starry_background_layer_03_stars",
      { x: 0, y: 0, speed: 0.5 }
    );
    this.addSprite(
      "stars_copy",
      "starry_background_layer_03_stars",
      { x: 0, y: -this.rect.height, speed: 0.5 }
    );

    this.addSprite(
      "starry_background_layer_x_big_star",
      "starry_background_layer_x_big_star",
      { x: randf(0, this.rect.width), y: 0, speed: 0.3 }
    );

    this.addSprite(
      "starry_background_layer_x_big_star_02",
      "starry_background_layer_x_big_star_02",
      { x: randf(0, this.rect.width), y: -this.rect.height, speed: 0.3 }
    );

    this.addSprite(
      "starry_background_layer_x_black_hole",
      "starry_background_layer_x_black_hole",
      { x: randf(0, this.rect.width), y: -this.rect.height * 2, speed: 0.3 }
    );

    this.addSprite(
      "starry_background_layer_x_rotary_star",
      "starry_background_layer_x_rotary_star",
      { x: randf(0, this.rect.width), y: -this.rect.height * 3, speed: 0.3 }
    );

    this.addSprite(
      "starry_background_layer_x_rotary_star_02",
      "starry_background_layer_x_rotary_star_02",
      { x: randf(0, this.rect.width), y: -this.rect.height * 4, speed: 0.3 }
    );
  }

  // this function reuse an atlas data animation json file for multiple spritesheets.
  private parseFrom(prefix: string, bundleName: string, atlasDataKey: string) {
    const data = Assets.get(atlasDataKey);
    const frames: Record<string, unknown> = {};
    const animation: string[] = [];
    Object.values(data.frames).forEach((value, index) => {
      const key = `${prefix}_${bundleName}_${index}`;
      frames[key] = value;
      animation.push(key);
    });
    data.frames = frames;
    data.animations.animation = animation;
    return data;
  }

  private async addSprite(name: string, bundleName: string, props = {
    x: 0, y: 0, speed: 1
  }) {
    const data = this.parseFrom(name, bundleName, "starry_background");

    const baseTexture = Assets.get(bundleName);
    const spritesheet = new Spritesheet(baseTexture, data);
    await spritesheet.parse();

    const animatedSprite = new AnimatedSprite(spritesheet.animations.animation as any);
    animatedSprite.animationSpeed = this.speedAnimation;
    animatedSprite.position.set(props.x, props.y);
    animatedSprite.anchor.set(this.anchor);
    animatedSprite.name = name;
    animatedSprite.angle = 270;
    animatedSprite.play();

    const initialPosition = new Point();
    const update = (dt: number) => {
      animatedSprite.y += dt * props.speed;
      if (animatedSprite.y >= this.rect.height) {
        animatedSprite.position.set(initialPosition.x, initialPosition.y - this.rect.height);
      }
    }

    this.ticker.add(update, this);
    this.addChild(animatedSprite);
  }

  public draw(): void {
    const gr = new Graphics()
      .beginFill(this.color, this.alpha)
      .drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
      .endFill();
    this.addChild(gr);
  }
}
