import { AnimatedSprite as PixiJSAnimatedSprite, Texture as PixiJSTexture } from "pixi.js";

export default class AnimatedSprite {

  private sprite: PixiJSAnimatedSprite;

  constructor(name: string, srcs: string[]) {
    this.sprite = new PixiJSAnimatedSprite(this.textures(srcs));
    this.sprite.name = 'AnimatedSprite_' + name;
    this.sprite.animationSpeed = 0.1;
  }

  private textures(srcs: string[]) {
    return srcs.map(src => PixiJSTexture.from(src));
  }

  public pos(x: number, y: number): AnimatedSprite {
    this.sprite.position.set(x, y);
    return this;
  }

  public anchor(anchor: number): AnimatedSprite {
    this.sprite.anchor.set(anchor);
    return this;
  }

  public visible(): AnimatedSprite {
    this.sprite.visible = true;
    return this;
  }

  public hidden(): AnimatedSprite {
    this.sprite.visible = false;
    return this;
  }

  public angle(angle: number): AnimatedSprite {
    this.sprite.angle = angle;
    return this;
  }

  public loop(): AnimatedSprite {
    this.sprite.loop = true;
    return this;
  }

  build() {
    return this.sprite;
  }
}
