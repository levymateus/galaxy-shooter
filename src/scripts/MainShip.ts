import World from "core/World";
import decoretaMainShip from "prefab/SpaceShip";
import { GameObject, KinematicGameObject } from "core/GameObject";
import { isAnimatedSprite } from "core/typings";
import Keyboard from "core/Keyboard";
import Camera from "core/Camera";
import { vec } from "utils";
import { App } from "core/App";

export const MainShip = () => {

  const kgo = new KinematicGameObject("KinematicMainShip", start, update);
  const settings = App.settings.getKeyboardSettings();

  // vars
  const speed = vec(5, 5);
  let move = vec(0, 0);

  function start(o: GameObject) {
    const [,, ,] = World.calcWorldBounds();
    o.position = vec();
    o.removeChildren();
    decoretaMainShip(o, `MainShip`);
    playEngine(o);

    new Camera(o.root);
  }

  function update(dt: number) {

    move = vec(0, 0);

    if (Keyboard.isKeyDown(settings.MoveUp) && kgo.position.y >= Camera.MAX_CAMERA_Y) {
      move.y = speed.y * -1;
    }
    if (Keyboard.isKeyDown(settings.MoveDown) && kgo.position.y <= Camera.MIN_CAMERA_Y) {
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

  function playEngine(o: GameObject) {
    const as = o.getByName('AnimatedSprite_MainShip_Engine');
    if (as && isAnimatedSprite(as)) {
      as.play();
    }
  }

}

