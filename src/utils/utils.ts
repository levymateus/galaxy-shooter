import { Point, RAD_TO_DEG } from "@pixi/math"
import { Textures } from "core/typings"
import { Container, DisplayObject, FrameObject, Ticker } from "pixi.js"

type Dice = { roll: (() => number) }

export class MathUtils {
  static TO_MILLISECONDS = 1000

  /**
   * Return a milliseconds number value.
   * @param secs - a number value in seconds.
   * @returns a number value in milliseconds.
   */
  static sec2ms(secs: number): number {
    return secs * MathUtils.TO_MILLISECONDS
  }

  /**
   * NO USED!
   * Generates a random integer number between `min` and `max` value.
   * @param min The minimum value
   * @param max The maximum value.
   * @returns
   */
  static randi(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * Generates a random float number between `min` and `max` value.
   * @param min The minimum value
   * @param max The maximum value.
   * @returns
   */
  static randf(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toString())
  }

  /**
   * Returns the angle (degress) between 2 points.
   * @param a The point A
   * @param b The point B
   * @returns An angle number value in degress
   */
  static angleBetween(a: Point, b: Point): number {
    const dist = b.clone().subtract(a.clone())
    const angle = Math.atan2(dist.y, dist.x) * RAD_TO_DEG
    if (Number.isNaN(angle)) return 0
    return angle
  }

  /**
   * Rotate a Point (Vector 2D) from an angle in degress.
   * @param point The point
   * @param angle The angle in degress
   * @returns A new rotated Point
   */
  static rotatePoint(point: Point, angle: number): Point {
    const radians = angle * (Math.PI / 180)
    return new Point(
      point.x * Math.cos(radians) - point.y * Math.sin(radians),
      point.x * Math.sin(radians) + point.y * Math.cos(radians)
    )
  }

  static add(a: Point, b: Point, range?: [Point, Point]): Point {
    const point = a.add(b)
    if (range) {
      const [min, max] = range
      if (point.x >= max.x)
        point.x = max.x
      if (point.x <= min.x)
        point.x = min.x
      if (point.y >= max.y)
        point.y = max.y
      if (point.y <= min.y)
        point.y = min.y
    }
    return point
  }

  /**
   * NO USED!
   * Create a dice
   * @param sides The number of sides
   * @returns A dice object
   */
  static dice(sides: number): Dice {
    const dice = {
      sides: sides,
      roll: () => {
        return Math.floor(Math.random() * sides) + 1
      }
    }
    return dice
  }
}

export class ContainerUtils {
  /**
   * Adds a child to a container.
   * @param container The `Container` thats the child should be added
   * @param child The child proper.
   * @param name The required name of the child param
   * @returns The added chield
   */
  static addChild = <T extends DisplayObject>(
    container: Container,
    child: T,
    name: string
  ): T => {
    child.name = name
    return container.addChild(child)
  }
  /**
   * Remove child by you name if exists.
   * @param container The `Container` thats the child should be removed
   * @param name The child name string
   */
  static removeChildByName = (container: Container, name: string): void => {
    const child = container.getChildByName(name)
    child && container.removeChild(child)
  }

  static fadeOut(container: Container, alpha: number, complete: () => void) {
    const fadeOut = (dt: number) => {
      container.alpha -= alpha * dt
      if (container.alpha <= 0) {
        handleComplete()
      }
    }

    const handleComplete = () => {
      complete()
      Ticker.shared.remove(fadeOut)
    }

    Ticker.shared.add(fadeOut)
  }
}

export class FrameObjects {
  static from(textures: Textures): FrameObject[] {
    return textures.map((texture) => ({ texture, time: 100 }))
  }
}
