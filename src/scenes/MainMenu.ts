import { Scene } from "core";
import { Activity } from "core/typings";
import { SpaceShooterEvents } from "typings";

export default class MainMenu implements Activity<SpaceShooterEvents> {
  public name: string;
  async onStart(scene: Scene<SpaceShooterEvents>) {
    scene.name = "main_menu";
    this.name = scene.name;
  }
  onUpdate(_: number): void {}
  async onFinish(): Promise<void> {}
}
