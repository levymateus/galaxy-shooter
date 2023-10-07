import { Container } from "pixi.js";
import { SpaceShooterEvents } from "typings";
import GUI from "ui/GUI";
import Score from "ui/Score";
import { Activity } from "ui/typings";

export default class HUD extends Container implements Activity<SpaceShooterEvents> {
  public name: string;
  private score: Score;
  private gui: GUI<SpaceShooterEvents>;

  private addScore(): void {
    this.score = new Score();
    this.score.text.anchor.set(1);
    this.score.x += this.gui.bounds.width - 8;
    this.score.y += this.score.text.height + 8;
    this.gui.emitter.on("scoreIncrement", this.score.inc, this.score);
    this.gui.addChild(this.score);
  }

  public async onStart(gui: GUI<SpaceShooterEvents>): Promise<void> {
    this.gui = gui;
    this.addScore();
  }

  onUpdate(): void {
    // throw new Error("Method not implemented.");
  }

  async onFinish(): Promise<void> {
    // throw new Error("Method not implemented.");
  }
}
