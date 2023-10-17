import { AxisAlignedBounds, EventEmitter, Surface, GameObject } from "core"
import { Manager } from "core/Manager"
import { Container, ObservablePoint, Rectangle, Ticker, utils } from "pixi.js"
import { GameObjectConstructor } from "./typings"

export class Context<E extends utils.EventEmitter.ValidEventTypes> extends Container {
  name: string
  manager: Manager<E>
  bounds: AxisAlignedBounds
  emitter: EventEmitter<E>
  anchor: ObservablePoint
  private surface: Surface
  private ticker: Ticker

  constructor(surface: Surface, screen: Rectangle) {
    super()
    this.surface = surface
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

  async create<T extends GameObject<E>>(ctor: GameObjectConstructor<E>): Promise<T> {
    const gameObject = new ctor(this, ctor.name)
    this.ticker.add(gameObject.onUpdate, gameObject)
    await gameObject.onStart(this)
    if (!this.ticker.started) {
      this.ticker.start()
    }
    return this.addChild(gameObject) as T
  }
}
