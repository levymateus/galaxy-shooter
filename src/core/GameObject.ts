import {
  Activity,
  ActivityElement,
  Context,
  Textures
} from "core"
import {
  AnimatedSprite,
  Container,
  FrameObject,
  IDestroyOptions,
  ObservablePoint,
  Point,
  Sprite,
  SpriteSource,
  utils,
} from "pixi.js"
import { ContainerUtils, MathUtils } from "utils/utils"

/**
 * The `GameObject` is a base class that extends the `PIXI.Container`.
 */
export class AbstractGameObject
  extends Container implements Activity, ActivityElement {
  readonly name: string
  readonly emitter: utils.EventEmitter
  anchor: ObservablePoint

  constructor(
    public context: Context,
    name: string,
  ) {
    super()
    this.name = name
    this.emitter = new utils.EventEmitter()
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

  /**
   * Called before adds the `GameObject` on the stage.
   * @param context The `Context` of the current `GameObject`.
   */
  async onStart(context: Context, ...args: unknown[]): Promise<void> {
    this.context = context
    return void args
  }

  /**
   * Called on each frame.
   * @param delta Scalar time value from last frame to this frame.
   * @returns void
   */
  onUpdate(delta: number): void {
    return void delta
  }

  // TODO: this callback is never called!!!
  async onFinish(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  /**
   * Instantiate animated sprite from source and add as child.
   * @param textures An array of textures
   * @param name The name of the sprite
   * @returns An `AnimatedSprite` instance
   */
  addAnimatedSprite(
    textures: Textures | FrameObject[],
    name: string
  ): AnimatedSprite {
    return ContainerUtils.addChild(this, new AnimatedSprite(textures), name)
  }

  /**
   * Instantiate sprite from source and add as child.
   * @param source The sprite source
   * @param name The name of the sprite
   * @returns A `Sprite` instance
   */
  addSprite(source: SpriteSource, name: string): Sprite {
    return ContainerUtils.addChild(this, Sprite.from(source), name)
  }

  /**
   * Remove child by you name if exists.
   * @param name The child name string
   */
  removeChildByName(name: string): void {
    return ContainerUtils.removeChildByName(this, name)
  }

  /**
   * Rotate to a point.
   * @param to The point to rotate
   */
  look(to: Point) {
    if (this.position.x && this.position.y)
      this.angle = MathUtils.angleBetween(this.position.normalize(), to) - 270
  }

  /**
   * Removes all internal references and listeners as well
   * as removes children from the display list.
   *
   * Do not use a `GameObject` after calling destroy.
   * @param options
   */
  destroy(options?: boolean | IDestroyOptions | undefined): void {
    this.emitter.removeAllListeners()
    this.context.removeChild(this)?.destroy(options)
  }

  clone(): AbstractGameObject {
    return new AbstractGameObject(this.context, this.name)
  }
}
