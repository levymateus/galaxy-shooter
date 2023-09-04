import { Sprite as PixiJSSprite } from "pixi.js";

export default class Sprite {

  private sprite: PixiJSSprite;

  constructor(name: string, src: string) {
    this.sprite = PixiJSSprite.from(src);
    this.sprite.anchor.set(0.5);
    this.sprite.visible = true;
    this.sprite.name = 'Sprite_' + name;
  }

  public pos(x: number, y: number): Sprite {
    this.sprite.position.set(x, y);
    return this;
  }

  public move(x: number, y: number) {
    this.sprite.position = {
      x: this.sprite.position.x + x,
      y: this.sprite.position.y + y
    };
  }

  public anchor(anchor: number): Sprite {
    this.sprite.anchor.set(anchor);
    return this;
  }

  public visible(): Sprite {
    this.sprite.visible = true;
    return this;
  }

  public hidden(): Sprite {
    this.sprite.visible = false;
    return this;
  }

  public angle(angle: number): Sprite {
    this.sprite.angle = angle;
    return this;
  }

  public build() {
    return this.sprite;
  }
}
