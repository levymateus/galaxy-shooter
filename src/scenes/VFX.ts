import { Context } from "core";
import { Activity } from "core/SceneManager";
import { SpaceShooterEvents } from "typings";

export default class VFX extends Activity<SpaceShooterEvents> {
  async onStart(context: Context<SpaceShooterEvents>) {
    this.context = context;
  }
  onUpdate(_: number): void { }
  async onFinish(): Promise<void> { }
  public destroy(): void { }
}
