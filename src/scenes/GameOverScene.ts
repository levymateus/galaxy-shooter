import { Context, Timer } from "core";
import { AppEvents } from "typings";
import { Text } from "ui";
import { Scene } from "managers/SceneManager";

export default class GameOverScene extends Scene {
  timer: Timer;

  async onStart(context: Context<AppEvents>) {
    this.context = context;
    const text = new Text("Game Over!");
    text.style.align = "center";
    text.anchor.set(0.5);
    this.context.addChild(text);
  }

  onUpdate(): void { }
}
