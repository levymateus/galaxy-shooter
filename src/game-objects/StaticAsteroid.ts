import World from "core/World";
import decorateAsteroid from "game-objects/Asteroid";

import { GameObject, StaticGameObject } from "core/GameObject";
import { randFloat, randInt, randVec } from "utils";

export const createStaticAsteroid = (): GameObject => {

  const sgo = new StaticGameObject("StaticAsteroid", start, update);

  let speed = randVec([0.0, 0.0, 0.24, 0.6]);
  let angle = randFloat(0.0, 0.8);

  function start(o: GameObject) {
    o.position = randVec(World.calcWorldBounds());
    decorateAsteroid(o, `Asteroid_00${randInt(1, 6)}`);
  }

  function update(dt: number) {
    const [, , , maxY] = World.calcWorldBounds();

    if (sgo.position.y > maxY) {
      reset();
    }

    rotate();

    GameObject.move(sgo, speed.x * dt, speed.y * dt);
  }

  function rotate() {
    sgo.forEachChild(c => { c.angle += angle; });
  }

  function reset() {
    const [minX, maxX, minY] = World.calcWorldBounds();

    speed = randVec([0.0, 0.0, 0.24, 0.6]);
    angle = randFloat(0.0, 0.8);

    sgo.position = randVec([minX, maxX, minY, minY]);
    sgo.removeChildren();

    decorateAsteroid(sgo, `Asteroid_00${randInt(1, 6)}`);
  }

  return sgo;
}

