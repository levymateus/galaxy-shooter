import { GameObject } from "core/GameObject";

import { Enemy } from "game-objects/Enemy";

export const createEnemy001 = (createEnemy: Enemy): GameObject => {

  const kgo = createEnemy(start, update);

  function start(o: GameObject) {
    console.log(o.name);
  }

  function update() {
    // console.log(kgo.name);
  }

  return kgo;

}
