import { Resolution } from "core"
import { Rectangle } from "pixi.js"

/**
 * The dynamic width and height lets us do some smart
 * scaling of the main game content; here we're just
 * using it to maintain a aspect ratio and giving
 * our scenes a width x height stage to work with
 */
export class Surface {
  private screen: Rectangle
  private res: Resolution

  constructor(screen: Rectangle, res: Resolution) {
    this.screen = screen
    this.res = res
  }

  get width() {
    return this.res.width
  }

  get height() {
    return this.res.height
  }

  actualWidth() {
    const [w, h] = this.res.ratio
    const aspectRatio = w / h
    const { width, height } = this.screen
    const isWidthConstrained = width < height * aspectRatio
    return isWidthConstrained ? width : height * aspectRatio
  }

  actualHeight() {
    const [w, h] = this.res.ratio
    const aspectRatio = h / w
    const { width, height } = this.screen
    const isHeightConstrained = width * aspectRatio > height
    return isHeightConstrained ? height : width * aspectRatio
  }
}
