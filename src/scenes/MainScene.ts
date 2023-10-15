import {
  Context, Timer,
} from "core";
import { Asteroid } from "entities/Asteroid";
import { gotoGameOverScene } from "index";
import { Ticker } from "pixi.js";
import { Scene } from "managers/SceneManager";
import { SpaceShooterEvents } from "typings";

export default class MainScene extends Scene {
  static SCENE_NAME = "main_scene";

  async onStart(context: Context<SpaceShooterEvents>) {
    super.onStart(context);
    async function spawn() {
      for (let i = 0; i < 2; i++) {
        context.create(Asteroid);
      }
    }
    spawn();
    new Timer().timeout(gotoGameOverScene, 2000);
    console.log(Ticker.shared.count);
  }

  onUpdate(dt: number): void {
    super.onUpdate(dt);
  }
}
