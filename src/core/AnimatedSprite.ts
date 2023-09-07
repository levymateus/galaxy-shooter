import { AnimatedSprite as PixiJSAnimatedSprite, Texture as PixiJSTexture } from "pixi.js";
import { AnimatedSprite } from "core/typings";

// A AnimatedSprite builder.
export default class AnimatedSpriteBuilder {

  private sprite: PixiJSAnimatedSprite;

  constructor(name: string, srcs: string[]) {
    this.sprite = new PixiJSAnimatedSprite(this.textures(srcs));
    this.sprite.name = 'AnimatedSprite_' + name;
    this.sprite.animationSpeed = 0.1;
  }

  private textures(srcs: string[]) {
    return srcs.map(src => PixiJSTexture.from(src));
  }

  public pos(x: number, y: number): AnimatedSpriteBuilder {
    this.sprite.position.set(x, y);
    return this;
  }

  public anchor(anchor: number): AnimatedSpriteBuilder {
    this.sprite.anchor.set(anchor);
    return this;
  }

  public visible(): AnimatedSpriteBuilder {
    this.sprite.visible = true;
    return this;
  }

  public hidden(): AnimatedSpriteBuilder {
    this.sprite.visible = false;
    return this;
  }

  public angle(angle: number): AnimatedSpriteBuilder {
    this.sprite.angle = angle;
    return this;
  }

  public scale(scale: number): AnimatedSpriteBuilder {
    this.sprite.scale.set(scale, scale);
    return this;
  }

  public loop(): AnimatedSpriteBuilder {
    this.sprite.loop = true;
    return this;
  }

  public play(): AnimatedSpriteBuilder {
    this.visible();
    this.loop();
    this.sprite.play();
    return this;
  }

  build(): AnimatedSprite {
    return this.sprite;
  }
}
