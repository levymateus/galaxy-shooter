import { Context } from "core";
import { SpaceShooterEvents } from "typings";
import { Scene } from "../managers/SceneManager";

export default class VFX extends Scene {
  async onStart(context: Context<SpaceShooterEvents>) {
    this.context = context;
  }
  onUpdate(_: number): void { }
  async onFinish(): Promise<void> { }
  destroy(): void { }
}
