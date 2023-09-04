import { Container } from "pixi.js";

import { App } from "core/App";
import { DestroyCallback, Node, StartCallback, UpdateCallback } from "core/typings";
import { Vec } from "src/typings";

export class GameObject {

  public name: string;
  private root: Container;
  private callStart?: StartCallback;
  private callUpdate?: UpdateCallback;
  private callDestroy?: DestroyCallback;

  constructor(
    name: string,
    start?: StartCallback,
    update?: UpdateCallback,
    destroy?: DestroyCallback,
  ) {
    this.name = name;
    this.root = new Container();

    this.callStart = start;
    this.callUpdate = update;
    this.callDestroy = destroy;

    if (this.callUpdate) App.app.ticker.add(this.callUpdate);
    if (this.callStart) this.callStart(this);

    App.app.stage.addChild(this.root);
  }

  set position(pos: Vec) {
    this.root.position.set(pos.x, pos.y);
  }

  get position() {
    return this.root.position;
  }

  public move(x: number, y: number) {
    this.position = {
      x: this.root.position.x + x,
      y: this.root.position.y + y
    };
  }

  public rotate(angle: number) {
    this.root.angle += angle;
  }

  public add(node: Node) {
    this.root.addChild(node);
  }

  public removeChildren() {
    this.root.removeChildren();
  }

  public getByName(name: string): Node | null {
    return this.root.getChildByName(name);
  }

  public destroy() {
    if (this.callDestroy) this.callDestroy();
    if (this.callUpdate) App.app.ticker.remove(this.callUpdate);
    this.root.destroy();
  }
}

export class StaticGameObject extends GameObject {
  constructor(
    name: string,
    start?: StartCallback,
    update?: UpdateCallback,
    destroy?: DestroyCallback,
  ) {
    super(name, start, update, destroy);
  }
}

export class KinematicGameObject extends GameObject {
  constructor(
    name: string,
    start?: StartCallback,
    update?: UpdateCallback,
    destroy?: DestroyCallback,
  ) {
    super(name, start, update, destroy);
  }
}

