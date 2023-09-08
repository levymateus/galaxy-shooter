import { GameObject } from "core/GameObject";
import { Container } from "pixi.js";
import { App } from "./App";

import Sprite from "core/Sprite";
import World from "core/World";
import { withSmallAsteroids } from "game-objects/Asteroid";
import { createStaticAsteroid } from "game-objects/StaticAsteroid";
import { Sprite as PixiJSSprite } from "pixi.js";
import { Vec } from "src/typings";
import { randFloat, randInt, randVec } from "utils";

export default class Level {

  private container: Container;
  private player: GameObject;

  public enemies: GameObject[];
  public asteroids: GameObject[];

  constructor(name: string) {
    this.container = new Container();
    this.container.name = name;
    this.enemies = [];
    this.asteroids = [];
  }

  private createStarfield() {

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
      this.container.addChild(sprite);
    }

    App.app.ticker.add(function (dt) {
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

  private createAsteroids() {
    const count = 128;
    for (let i = 0; i <= count; i++) {
      const sa = withSmallAsteroids(createStaticAsteroid());
      this.container.addChild(sa.root);
    }
  }

  private load() {
    this.createStarfield();
    this.createAsteroids();
  }

  public addPlayer(player: GameObject): Level {
    this.player = player;
    return this;
  }

  public addEnemy(enemy: GameObject): Level {
    this.enemies.push(enemy);
    enemy.name += '_' + (this.enemies.length).toString();
    this.container.addChild(enemy.root);
    return this;
  }

  public addAsteroid(asteroid: GameObject): Level {
    this.asteroids.push(asteroid);
    asteroid.name += ' ' + (this.asteroids.length).toString();
    this.container.addChild(asteroid.root);
    return this;
  }

  public start(): Level {
    this.load();
    this.container.addChild(this.player.root);
    App.app.stage.addChild(this.container);
    return this;
  }
}


