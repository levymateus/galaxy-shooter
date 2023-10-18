import { ObservablePoint, Rectangle as PixiRectangle } from "pixi.js"

/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
 */
export class Rectangle extends PixiRectangle {
  anchor: ObservablePoint

  constructor(x?: number, y?: number, width?: number, height?: number) {
    super(x, y, width, height)
    this.anchor = new ObservablePoint(
      this.onAnchorUpdate,
      this,
      this.x,
      this.y,
    )
  }

  private onAnchorUpdate() {
    this.x = -this.width * this.anchor.x
    this.y = -this.height * this.anchor.y
  }
}
