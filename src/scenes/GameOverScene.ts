import { Scene, Timer } from "core";
import { Activity } from "core/typings";
import { SpaceShooterEvents } from "typings";
import { Text } from "ui";
import { gotoMainScene } from "..";

export default class GameOverScene implements Activity<SpaceShooterEvents> {
  public static SCENE_NAME = "game_over_scene";
  public static SCENE_TIMEOUT = 3000;
  public name: string;
  private scene: Scene<SpaceShooterEvents>;

  private addGameOverMessage() {
    const text = new Text("Game Over!");
    text.style.align = "center";
    text.anchor.set(0.5);
    this.scene.addChild(text);
  }

  async onStart(scene: Scene<SpaceShooterEvents>) {
    scene.name = GameOverScene.SCENE_NAME;
    this.scene = scene;
    this.addGameOverMessage();
    new Timer().timeout(gotoMainScene, GameOverScene.SCENE_TIMEOUT);
  }

  onUpdate(_: number): void { }

  async onFinish(): Promise<void> { }

}
