import { GameObject } from "core/GameObject";
import Sprite from "core/Sprite";
import { randFloat, randInt, randVec } from "utils";

export default function(o: GameObject, name: string): GameObject {
  const src = `assets/Asteroid/${name}.png`;
  o.add(
    new Sprite("Asteroid", src)
      .visible()
      .anchor(0.5)
      .angle(randFloat(0, 360))
      .build(),
  );

  for (let j = 0; j <= randInt(0, 2); j++) {
    const pos = randVec([-128, 128, -128, 128]);
    o.add(
      new Sprite(`Asteroid_00${j}`, 'assets/Asteroid/Asteroid_007.png')
        .pos(pos.x, pos.y)
        .anchor(0.5)
        .angle(randFloat(0, 360))
        .build(),
    );
  }

  return o;
}
