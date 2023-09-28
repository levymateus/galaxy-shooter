import MainScene from "scenes/MainScene";
import { Game } from "core";
import { Container } from "pixi.js";
import { ISceneGraph } from "core/typings";

export default class Menu implements ISceneGraph {

  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  async onStart(root: Container) {
    root.name = "main_menu";
    this.game.gotoScene(new MainScene(this.game));
  }

  onUpdate(_: number): void {
    throw new Error("Method not implemented.");
  }

  onFinish(): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
