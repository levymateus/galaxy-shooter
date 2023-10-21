import { Point, RAD_TO_DEG } from "@pixi/math"
import { Container, DisplayObject } from "pixi.js"

type Dice = { roll: (() => number )}

export class MathUtils {
  /**
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
   * @returns An angle number value
   */
  static angleBetween(a: Point, b: Point): number {
    const dist = b.clone().subtract(a.clone())
    const angle = Math.atan2(dist.y, dist.x) * RAD_TO_DEG
    if (Number.isNaN(angle)) return 0
    return angle
  }

  /**
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

export class IDUtils {
  /**
   * Returns a new random unique identifies string value.
   */
  static get(): string {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
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
  static addChild = <T extends DisplayObject>(container: Container, child: T, name: string): T => {
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
}
