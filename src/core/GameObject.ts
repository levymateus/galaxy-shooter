import EventEmitter from "core/EventEmitter";
import { GameObjectEvents, KinematicBody } from "core/typings";
import { Circle, Container, IDestroyOptions, Point, Ticker, TickerCallback } from "pixi.js";

/**
 * Receive a GameObject thats collides.
 */
type CollideCallback = ((go: GameObject) => void);

export default class GameObject extends Container implements KinematicBody {

  public id: string;
  public name: string;
  public speed: Point;

  /**
   * enable or disable collision test.
   * Default is `true`.
   */
  public collisionTest: boolean = true;
  public collisionShape: Circle;
  public events: EventEmitter<GameObjectEvents>;
  public rotate: number;
  public tiker: Ticker;

  private _update: TickerCallback<GameObject>;
  private _collide: CollideCallback;

  constructor(name: string) {
    super();
    this.id = crypto.randomUUID();
    this.name = name;
    this.speed = new Point();
    this.collisionShape = new Circle(0, 0, 16);
    this.events = new EventEmitter();
    this.rotate = 0;
    this.tiker = new Ticker();
    this.tiker.start();
  }

  /**
   * Add add listner for tick events.
   * @details is removed on call destory().
   */
  set update(callback: TickerCallback<GameObject>) {
    this._update = callback;
    this.tiker.add(this._update, this);
  }

  /**
   * Add a collision listener.
   * @details is removed on call destory().
   */
  set collide(callback: CollideCallback) {
    this._collide = callback;
    this.events.on('onCollide', this._collide, this);
  }

  protected removeEventListeners(): void {
    this.tiker.remove(this._update, this).destroy();
    this.events.removeListener('onCollide', this._collide, this);
  }

  /**
   * CAUTION: can cause side effects in lines above this call.
   */
  public destroy(options?: boolean | IDestroyOptions | undefined): void {
    this.removeEventListeners();
    super.destroy(options);
  }
}
