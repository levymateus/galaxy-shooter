import { Circle, Container, Point } from "pixi.js";
import { HitTestEvents, KinematicBody } from "core/typings";
import EventEmitter from "core/EventEmitter";

export default class GameObject extends Container implements KinematicBody {

  public id: string;
  public name: string;
  public speed: Point;
  public collisionShape: Circle;
  public events: EventEmitter<HitTestEvents>;
  public rotate: number;

  constructor(name: string) {
    super();
    this.id = crypto.randomUUID();
    this.name = name;
    this.speed = new Point();
    this.collisionShape = new Circle(0, 0, 16);
    this.events = new EventEmitter();
    this.rotate = 0;
  }
}
