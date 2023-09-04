import { GameObject } from "core/GameObject";
import Sprite from "core/Sprite";

export default function(o: GameObject, name: string): GameObject {
  const src = `assets/Asteroid/${name}.png`;
  o.add(
    new Sprite("Asteroid", src)
      .visible()
      .angle(180)
      .build(),
  );
  return o;
}
