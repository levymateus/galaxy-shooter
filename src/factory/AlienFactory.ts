import AnimatedSpriteBuilder from "core/AnimatedSprite";
import { GameObject } from "core/GameObject";

export enum Aliens {
  Alien001 = 'Alien001',
}

const buildAlien001 = (o: GameObject, name: string) => {
  o.add(new AnimatedSpriteBuilder(name + '_Alien', [
    'assets/Alien/Alien_001/Alien_001.png',
    'assets/Alien/Alien_001/Alien_002.png',
    'assets/Alien/Alien_001/Alien_003.png',
  ])
    .pos(0, 0)
    .anchor(0.5)
    .scale(0.9)
    .visible()
    .play()
    .build()
  );
  return o;
}

export default function (o: GameObject, name: string, type: Aliens): GameObject {
  switch (type) {
    case Aliens.Alien001:
      return buildAlien001(o, name);
    default:
      return o;
  }
}
