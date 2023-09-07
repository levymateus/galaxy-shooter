import { Container, ObservablePoint } from "pixi.js";
import { App } from "./App";

export default class Camera {

  static MAX_CAMERA_Y = App.app.view.height / 2;
  static MIN_CAMERA_Y = App.app.view.height / 2 * -1;
  static MIN_CAMERA_X = App.app.view.width / 2 * -1;
  static MAX_CAMERA_X = App.app.view.width / 2;

  private root: Container;
  private pivot: ObservablePoint;

  constructor(container: Container) {
    this.root = container;
    this.pivot = App.app.stage.pivot;

    this.pivot.x = this.root.position.x - App.app.view.width / 2;
    this.pivot.y = this.root.position.y - App.app.view.height / 2;
  }
}
