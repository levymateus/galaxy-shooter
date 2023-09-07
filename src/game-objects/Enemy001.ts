import Camera from "core/Camera";
import { GameObject } from "core/GameObject";

import { Enemy } from "game-objects/Enemy";
import { VecRange } from "typings";
import { randVec } from "utils";

const ENEMY_VEC_BOUNDS: VecRange = [Camera.MIN_CAMERA_X + 16, Camera.MAX_CAMERA_X - 16, Camera.MIN_CAMERA_Y, Camera.MIN_CAMERA_Y]

export const createEnemy001 = (createEnemy: Enemy): GameObject => {

  const kgo = createEnemy(start, update);
  const speedRange: VecRange = [0.025, 0.1, 0.5, 1.0];

  let speed = randVec(speedRange);

  function start(o: GameObject) {
    o.position = randVec(ENEMY_VEC_BOUNDS);
  }

  function update(dt: number) {
    if (kgo.position.y > Camera.MAX_CAMERA_Y) {
      reset();
    }

    GameObject.move(kgo, Math.sin(kgo.position.y * speed.x) * dt, speed.y * dt);
  }

  function reset() {
    speed = randVec(speedRange);
    kgo.position = randVec(ENEMY_VEC_BOUNDS);
  }

  return kgo;

}
