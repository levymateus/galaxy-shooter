import { Context } from "core";
import { Scene } from "managers/SceneManager";
import { SpaceShooterEvents } from "typings";
import Score from "ui/Score";

export default class HUD extends Scene {
  static GUI_NAME = "HUD";
  private score: Score;

  async onStart(context: Context<SpaceShooterEvents>): Promise<void> {
    this.context = context;
    this.context.zIndex = 1000;
    this.score = new Score();
    this.score.text.anchor.set(1);
    this.score.x = this.context.bounds.right - 8;
    this.score.y = this.context.bounds.y + this.score.text.height + 8;
    this.context.emitter.on("scoreIncrement", this.score.inc, this.score);
    this.context.addChild(this.score);
  }

  onUpdate(): void {
    // throw new Error("Method not implemented.");
  }

  async onFinish(): Promise<void> {
    // this.context.removeAllListeners();
  }
}
