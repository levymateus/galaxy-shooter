import { App } from "core/App";
import Camera from "core/Camera";
import { GameObject } from "core/GameObject";
import Keyboard from "core/Keyboard";
import { vec } from "utils";

import type { MainShip } from "./MainShip";

export const createPlayer = (createMainShip: MainShip): GameObject => {

  const kgo = createMainShip(start, update);
  const settings = App.settings.getKeyboardSettings();

  // vars
  const speed = vec(5, 5);
  let move = vec(0, 0);

  function start(o: GameObject) {
    new Camera(o.root);
  }

  function update(dt: number) {

    move = vec(0, 0);

    if (Keyboard.isKeyDown(settings.MoveUp)) {
      move.y = speed.y * -1;
    }
    if (Keyboard.isKeyDown(settings.MoveDown)) {
      move.y = speed.y;
    }
    if (Keyboard.isKeyDown(settings.MoveLeft)) {
      move.x = speed.x * -1;
    }
    if (Keyboard.isKeyDown(settings.MoveRight)) {
      move.x = speed.x;
    }

    GameObject.move(kgo, move.x * dt, move.y * dt);
  }

  return kgo;

}
