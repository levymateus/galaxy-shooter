import { AxisAlignedBounds, EventEmitter } from "core";
import { GameObjectEvents, KinematicBody } from "core/typings";
import { Circle, Container, IDestroyOptions, Point, Ticker, TickerCallback } from "pixi.js";
import { uid } from "utils/utils";

/**
 * Receive a GameObject thats collides.
 */
type CollideCallback = ((go: GameObject) => void);

type OutOfBoundsCallback = (bounds: AxisAlignedBounds) => void;

export class GameObject extends Container implements KinematicBody {
  public id: string;
  public name: string;
  public speed: Point;
  public anchor: number = 0.5;
  public speedAnimation: number = 0.4;
  /**
   * enable or disable collision test.
   * Default is `true`.
   */
  public collisionTest: boolean = true;
  public collisionShape: Circle;
  public events: EventEmitter<GameObjectEvents>;
  public rotate: number;
  public ticker: Ticker;

  private _update: TickerCallback<GameObject>;
  private _collide: CollideCallback;
  private _outofbounds: OutOfBoundsCallback;

  constructor(name: string) {
    super();
    this.id = uid();
    this.name = name;
    this.speed = new Point();
    this.collisionShape = new Circle(0, 0, 16);
    this.events = new EventEmitter();
    this.rotate = 0;
    this.ticker = new Ticker();
    this.ticker.start();
  }

  set update(callback: TickerCallback<GameObject>) {
    this._update = callback;
    this.ticker.add(this._update, this);
  }

  set collide(callback: CollideCallback) {
    this._collide = callback;
    this.events.on('onCollide', this._collide, this);
  }

  set outofbounds(callback: OutOfBoundsCallback) {
    this._outofbounds = callback;
    this.events.on('outOfWorldBounds', this._outofbounds, this);
  }

  public destroy(options?: boolean | IDestroyOptions | undefined): void {
    this.events.removeAllListeners();
    this.ticker.stop();
    this.ticker.remove(this._update, this);
    this.ticker.destroy();
    super.destroy(options);
  }

  public clone(): GameObject {
    return new GameObject(this.name);
  }
}
