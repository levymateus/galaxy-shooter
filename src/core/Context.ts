import {
  Core,
  ActivityElement,
  ActivityElementCtor,
  EventEmitter,
  Manager,
  Surface
} from "core"
import {
  Container,
  Graphics,
  ObservablePoint,
  Rectangle,
  Ticker,
  utils
} from "pixi.js"

export type ContextChildren<
  E extends utils.EventEmitter.ValidEventTypes> = ActivityElement<E>[]

/**
 * The Context is the root Container of an activity.
 * The Context provide the convient references to the children,
 * like an observable `EventEmitter` and a `AxisAlignedBounds`.
 */
export class Context<
  E extends utils.EventEmitter.ValidEventTypes>
    extends Container
{
  name: string
  manager: Manager<E>
  bounds: Core.AxisAlignedBounds
  emitter: EventEmitter<E>
  anchor: ObservablePoint
  children: ContextChildren<E>
  private surface: Surface
  private ticker: Ticker
  private maskRef: Graphics

  constructor(
    surface: Surface,
    screen: Rectangle,
    name: string,
    manager: Manager<E>,
    bounds: Core.AxisAlignedBounds,
    emitter: EventEmitter<E>
  ) {
    super()
    this.surface = surface
    this.name = name
    this.manager = manager
    this.bounds = bounds
    this.emitter = emitter
    this.x = screen.width / 2 - this.surface.actualWidth() / 2
    this.y = screen.height / 2 - this.surface.actualHeight() / 2
    this.width = this.surface.width
    this.height = this.surface.height
    this.scale.x = this.surface.actualWidth() / this.surface.width
    this.scale.y = this.surface.actualHeight() / this.surface.height
    this.anchor = new ObservablePoint(
      this.onAnchorUpdate,
      this,
      this.x,
      this.y,
    )
    this.ticker = new Ticker()
    this.ticker.autoStart = false
    this.ticker.maxFPS = 60
    this.ticker.minFPS = 60
    this.sortableChildren = true
    this.addMask()
  }

  private addMask() {
    const name = [this.name, 'Mask'].join('_')
    this.getChildByName(name)?.destroy({ children: true })
    const mask = new Graphics()
    mask.name = name
    mask.beginFill()
    mask.drawRect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    )
    mask.endFill()
    mask.pivot.x = mask.width * 0.5 * -1
    mask.pivot.y = mask.height * 0.5 * -1
    this.mask = mask
    this.maskRef = mask
    this.addChild(mask)
  }

  private onAnchorUpdate() {
    this.pivot.x = this.surface.width * this.anchor.x
    this.pivot.y = this.surface.height * this.anchor.y
    this.maskRef.pivot.x -= this.pivot.x
    this.maskRef.pivot.y -= this.pivot.y
  }

  /**
   * Instantiate and setup a `GameObject` and add
   * as a child of the current context.
   *
   * @param ctor The constructor of the game object that should be instantiated.
   * @param args Spreaded args passed to the instantiated object.
   * @returns An instance of a game object.
   */
  async create<T>(
    ctor: ActivityElementCtor<E>,
    ...args: unknown[]
  ): Promise<T> {
    const el = new ctor(this, ctor.name)
    this.ticker.add(el.onUpdate, el)
    await el.onStart(this, ...args)
    if (!this.ticker.started) this.ticker.start()
    return this.addChild(el) as T
  }

  /**
   * Remove update listener of the context children.
   */
  removeUpdates() {
    this.children.forEach(child => this.ticker.remove(child.onUpdate, child))
  }

  /**
   * Add update listener of the context children.
   */
  addUpdates() {
    this.children.forEach(child => this.ticker.add(child.onUpdate, child))
  }

  /**
   * Returns the context manager.
   * @returns The context `Manager` instance.
   */
  getManager<T extends Manager<E>>(): T {
    return this.manager as T
  }
}
