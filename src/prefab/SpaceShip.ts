import AnimatedSprite from "core/AnimatedSprite";
import { GameObject } from "core/GameObject";
import Sprite from "core/Sprite";

export default function (o: GameObject, name: string): GameObject {
  const src = `assets/MainShip/${name}.png`;
  o.add(new Sprite(name + '_MainShip', src).visible().build());
  o.add(new AnimatedSprite(name + '_Engine', [
      'assets/MainShip/Engine_001.png',
      'assets/MainShip/Engine_002.png',
      'assets/MainShip/Engine_003.png',
    ])
    .pos(0, 14)
    .anchor(0.5)
    .visible()
    .build()
  );
  return o;
}
