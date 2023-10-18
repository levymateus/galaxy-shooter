import { Activity, ActivityElement, Context, EventEmitter } from "core"
import { Circle, Container, IDestroyOptions, ObservablePoint, utils } from "pixi.js"
import { uid } from "utils/utils"

/**
 * The `GameObject` is a base class that extends the `PIXI.Container`.
 */
export class GameObject<E extends utils.EventEmitter.ValidEventTypes>
  extends Container implements Activity<E>, ActivityElement<E> {
  readonly name: string
  readonly id: string
  readonly emitter: EventEmitter<E>

  /**
   * enable or disable collision test.
   * Default is `true`.
   */
  collisionTest: boolean

  /**
   * Shape used to test collision.
   */
  collisionShape: Circle
  anchor: ObservablePoint

  protected context: Context<E>

  constructor(context: Context<E>, name: string) {
    super()
    this.id = uid()
    this.name = name
    this.collisionTest = true
    this.collisionShape = new Circle(0, 0, 16)
    this.context = context
    this.emitter = new EventEmitter()
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

  async onStart(context: Context<E>): Promise<void> {
    this.context = context
  }

  onUpdate(delta: number): void {
    return void delta
  }

  async onFinish(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  destroy(options?: boolean | IDestroyOptions | undefined): void {
    this.emitter.removeAllListeners()
    this.context.removeChild(this)?.destroy(options)
  }

  clone(): GameObject<E> {
    return new GameObject(this.context, this.name)
  }
}
