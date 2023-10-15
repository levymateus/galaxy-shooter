import { AxisAlignedBounds as PixiAxisAlignedBounds } from "@pixi-essentials/bounds";
import { ObservablePoint } from "pixi.js";

export class AxisAlignedBounds extends PixiAxisAlignedBounds {
  anchor: ObservablePoint;

  constructor(x?: number, y?: number, width?: number, height?: number) {
    super(x, y, width, height);
    this.anchor = new ObservablePoint(
      this.onAnchorUpdate,
      this,
      this.x,
      this.y,
    );
  }

  private onAnchorUpdate() {
    this.x = -this.width * this.anchor.x;
    this.y = -this.height * this.anchor.y;
  }
}
