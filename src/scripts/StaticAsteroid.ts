import World from "core/World";
import decorateAsteroid from "prefab/Asteroid";

import { GameObject, StaticGameObject } from "core/GameObject";
import { randFloat, randVec } from "utils";

export const StaticAsteroid = () => {

  const sgo = new StaticGameObject("StaticAsteroid", start, update);

  function start(o: GameObject) {
    const worldBounds = World.calcWorldBounds();
    o.position = randVec(worldBounds);
    o.removeChildren();
    decorateAsteroid(o, `Asteroid_00${randFloat(1, 6)}`);
  }

  function update(dt: number) {
    const [, , , maxY] = World.calcWorldBounds();

    if (sgo.position.y > maxY) {
      reset();
    }

    GameObject.move(sgo, 0 * dt, 1 * dt);
    sgo.rotate(1);
  }

  function reset() {
    start(sgo);
  }
}

