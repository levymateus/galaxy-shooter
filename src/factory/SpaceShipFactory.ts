import AnimatedSpriteBuilder from "core/AnimatedSprite";
import { GameObject } from "core/GameObject";
import Sprite from "core/Sprite";

export enum SpaceShips {
  MainShip = 'MainShip',
  SpaceShip_001 = 'SpaceShip_001',
}

const buildMainShip = (o: GameObject, name: string) => {
  const src = `assets/MainShip/${name}.png`;
  o.add(new Sprite(name + '_MainShip', src).visible().build());
  o.add(new AnimatedSpriteBuilder(name + '_Engine', [
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

const buildEnemyShip001 = (o: GameObject, name: string) => {
  const src = `assets/SpaceShip/${SpaceShips.SpaceShip_001}.png`;
  o.add(new Sprite(name + '_Enemy001', src).visible().angle(180).build());
  return o;
}

export default function (o: GameObject, name: string, type: SpaceShips): GameObject {
  switch (type) {
    case SpaceShips.MainShip:
      return buildMainShip(o, name);
    case SpaceShips.SpaceShip_001:
      return buildEnemyShip001(o, name);
    default:
      return o;
  }
}
