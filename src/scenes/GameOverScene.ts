import { Context, Timer } from "core";
import { SpaceShooterEvents } from "typings";
import { Text } from "ui";
import { gotoMainScene } from "..";
import { Scene } from "../managers/SceneManager";

export default class GameOverScene extends Scene {
  static SCENE_NAME = "game_over_scene";
  static SCENE_TIMEOUT = 1000;

  async onStart(context: Context<SpaceShooterEvents>) {
    this.context = context;
    const text = new Text("Game Over!");
    text.style.align = "center";
    text.anchor.set(0.5);
    this.context.addChild(text);
    new Timer().timeout(gotoMainScene, GameOverScene.SCENE_TIMEOUT);
  }

  onUpdate(_: number): void { }
  async onFinish(): Promise<void> { }
}
