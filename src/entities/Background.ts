import { Drawable, Rectangle } from "core";
import { Container, Graphics } from "pixi.js";

/**
 * Scene background root node.
 */
export default class Background extends Container implements Drawable {

  public color: number = 0x000000;
  public alpha: number = 1;
  private rect: Rectangle;

  constructor(rect: Rectangle) {
    super();
    this.name = "background";
    this.rect = rect;
    this.rect.anchor.set(0.5);
    this.draw();
  }

  public draw(): void {
    const gr = new Graphics()
      .beginFill(this.color, this.alpha)
      .drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
      .endFill();
    this.addChild(gr);
  }
}
