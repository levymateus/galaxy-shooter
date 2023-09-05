import { Sprite as PixiJSSprite } from "pixi.js";
import type { Sprite } from "core/typings";

// A Sprite Builder
export default class SpriteBuilder {

  private sprite: PixiJSSprite;

  constructor(name: string, src: string) {
    this.sprite = PixiJSSprite.from(src);
    this.sprite.anchor.set(0.5);
    this.sprite.visible = true;
    this.sprite.name = 'Sprite_' + name;
  }

  public pos(x: number, y: number): SpriteBuilder {
    this.sprite.position.set(x, y);
    return this;
  }

  public anchor(anchor: number): SpriteBuilder {
    this.sprite.anchor.set(anchor);
    return this;
  }

  public visible(): SpriteBuilder {
    this.sprite.visible = true;
    return this;
  }

  public hidden(): SpriteBuilder {
    this.sprite.visible = false;
    return this;
  }

  public angle(angle: number): SpriteBuilder {
    this.sprite.angle = angle;
    return this;
  }

  public build(): Sprite {
    return this.sprite;
  }
}
