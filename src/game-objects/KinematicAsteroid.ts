import World from "core/World";
import decorateAsteroid from "game-objects/Asteroid";

import { GameObject, KinematicGameObject } from "core/GameObject";
import { randFloat, randVec } from "utils";
import Timer from "core/Timer";

export const createKinematicAsteroid = (): GameObject => {

  const kgo = new KinematicGameObject("KinematicAsteroid", start, update);

  let speed = randVec([0.0, 0.0, 0.24, 0.6]);
  let angle = randFloat(0.0, 0.8);

  function start(o: GameObject) {
    o.position = randVec(World.calcWorldBounds());
    decorateAsteroid(o, `Asteroid_006`);
  }

  function update(dt: number) {
    const [, , , maxY] = World.calcWorldBounds();

    if (kgo.position.y > maxY) {
      reset();
    }

    rotate();

    GameObject.move(kgo, speed.x * dt, speed.y * dt);
  }

  function rotate() {
    kgo.forEachChild(c => { c.angle += angle; });
  }

  function blink(o: GameObject) {
    Timer.tick((status) => {
      o.toggleVisible();
      if (status === 'complete') o.visible();
    }, 200, 1000);
  }

  function reset() {
    const [minX, maxX, minY] = World.calcWorldBounds();

    speed = randVec([0.0, 0.0, 0.24, 0.6]);
    angle = randFloat(0.0, 0.8);

    kgo.position = randVec([minX, maxX, minY, minY]);
    blink(kgo);

  }

  return kgo;
}

