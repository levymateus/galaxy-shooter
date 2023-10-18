import { ActivityElement, ActivityElementCtor, AxisAlignedBounds, EventEmitter, Manager, Surface } from "core"
import { Container, ObservablePoint, Rectangle, Ticker, utils } from "pixi.js"

export type ContextChildren<E extends utils.EventEmitter.ValidEventTypes> = ActivityElement<E>[]

/**
 * The Context is the root Container of an activity.
 * The Context provide the convient references to the children, like an observable `EventEmitter` and a `AxisAlignedBounds`.
 */
export class Context<E extends utils.EventEmitter.ValidEventTypes> extends Container {
  name: string
  manager: Manager<E>
  bounds: AxisAlignedBounds
  emitter: EventEmitter<E>
  anchor: ObservablePoint
  children: ContextChildren<E>
  private surface: Surface
  private ticker: Ticker

  constructor(
    surface: Surface,
    screen: Rectangle,
    name: string,
    manager: Manager<E>,
    bounds: AxisAlignedBounds,
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
  }

  private onAnchorUpdate() {
    this.pivot.x -= this.surface.width * this.anchor.x
    this.pivot.y -= this.surface.height * this.anchor.y
  }

  /**
   * Instantiate and setup a `GameObject` and add as a child of the current context.
   * @param ctor The constructor of the game object that should be instantiated.
   * @returns An instance of a game object.
   */
  async create<T>(ctor: ActivityElementCtor<E>): Promise<T> {
    const el = new ctor(this, ctor.name)
    this.ticker.add(el.onUpdate, el)
    await el.onStart(this)
    if (!this.ticker.started) this.ticker.start()
    return this.addChild(el) as T
  }

  /**
   * Remove update listener of the context children.
   */
  removeUpdates() {
    this.children.forEach(child =>  this.ticker.remove(child.onUpdate, child))
  }

  /**
   * Add update listener of the context children.
   */
  addUpdates() {
    this.children.forEach(child => this.ticker.add(child.onUpdate, child))
  }
}
