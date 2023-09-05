import { Sprite as PixiJSSprite } from "pixi.js";
import { App } from "core/App";
import Sprite from "core/Sprite";
import World from "core/World";
import { Vec } from "src/typings";
import { randFloat, randInt, randVec } from "utils";

export const Starfield = () => {

  const worldBounds = World.calcWorldBounds();
  const [minX, maxX, minY, maxY] = worldBounds;
  const stars: { sprite: PixiJSSprite, speed: Vec }[] = [];
  const dir = { x: 0.01, y: 1 };
  const count = 1024;

  for (let i = 0; i <= count; i++) {
    const name = `Star_00${randInt(1, 6)}`;
    const pos = randVec([minX, maxX, minY, maxY]);
    const speed = { x: 1, y: randFloat(0.1, 0.3) };
    const sprite = new Sprite(name, `assets/Star/${name}.png`)
      .pos(pos.x, pos.y)
      .build();
    stars.push({ sprite, speed });
    App.app.stage.addChild(sprite);
  }

  App.app.ticker.add(function(dt) {
    stars.forEach(({ sprite, speed }, index, array) => {
      sprite.position.set(
        sprite.position.x + speed.x * dir.x * dt,
        sprite.position.y + speed.y * dir.y * dt,
      );

      if (sprite.position.x >= maxX || sprite.position.y >= maxY) {
        const pos = randVec([minX, maxX, minY, minY]);
        array[index]?.sprite.position.set(pos.x, pos.y);
      }
    });
  });

}

