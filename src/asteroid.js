import app, { MAX_X, MIN_X, MIN_Y } from "./app";
import _enum from "./enum";

import * as Animations from "./animations";
import * as CollisionBody from "./collision/body";
import * as Keyboard from './keyboard';
import * as Emitter from "./particles/emitter";
import * as Stone from "./stone";

import { Container, Sprite, Texture } from "pixi.js";
import { randFloatBet, randIntBet } from "./utils";

const images = {
  sprites: [
    "assets/Asteroid/Asteroid_001.png",
    "assets/Asteroid/Asteroid_002.png",
    "assets/Asteroid/Asteroid_003.png",
    "assets/Asteroid/Asteroid_004.png",
    "assets/Asteroid/Asteroid_005.png",
    "assets/Asteroid/Asteroid_006.png",
    "assets/Asteroid/Asteroid_outline_006.png",
  ],
  explosion: [
    "assets/Explosion/Explosion_001.png",
    "assets/Explosion/Explosion_002.png",
    "assets/Explosion/Explosion_003.png",
    "assets/Explosion/Explosion_004.png",
  ],
}

export function create({
  x, y, z = -1, isStatic = false, speed = { x: 0, y: 1 }
}) {

  const initialSpeed = { ...speed };

  const props = {
    x, y, z, speed,
    label: _enum.Asteroid,
    static: isStatic,

    destroid: false,

    dir: { x: 0, y: 1 },

    body: null,
    start: null,
    restart: null,
    update: null,
    sprite: null,
    explode: null,
    destroy: null,
    oncollide: null,
    container: null,
    animations: null,
  };

  props.start = function () {

    props.container = new Container();
    props.container.position.set(x, y);

    props.body = !props.static ? CollisionBody.create(props) : null;

    props.animations = Animations.create();
    props.animations.add('explosion', images.explosion);

    if (props.static) {
      props.sprite = new Sprite(Texture.from(images.sprites[randIntBet(0, 4)]));

      for (let i = 0; i <= randIntBet(0, 2); i += 1) {
        Stone.create({
          x: randIntBet(-64, 64),
          y: randIntBet(-64, 64),
          container: props.container,
          speed: { y: 0, x: randFloatBet(0.1, 0.8) }
        });
      }
    }

    if (!props.static) {
      props.sprite = new Sprite(Texture.from(images.sprites[5]));
      props.speed = { x: 0, y: randFloatBet(1.3, 2.5) };
    }

    props.sprite.anchor.set(0.5);
    props.sprite.angle = randFloatBet(0, 360);
    props.container.addChild(props.sprite);
  }

  props.update = function (delta) {

    props.sprite.angle += 0.1 * delta * props.speed.y;

    props.x += props.speed.x * delta * props.dir.x;
    props.y += props.speed.y * delta * props.dir.y;

    props.container.position.set(props.x, props.y);

    if (props.static && Keyboard.isKeyDown('w') && props.speed.y <= initialSpeed.y * 4) {
      props.speed.y += 0.2;
    }

    if (props.static && Keyboard.isKeyDown('s') && props.speed.y - 0.02 >= initialSpeed.y) {
      props.speed.y -= 0.02;
    } else if (props.static && props.speed.y - 0.018 >= initialSpeed.y) {
      props.speed.y -= 0.018;
    }

    if (props.y >= app.view.height + app.stage.pivot.y + 32) {
      props.restart();
    }
  }

  props.oncollide = function (col) {
    if (props.destroid) return;
    switch (col.label) {
      case _enum.Player:
      case _enum.Bullet:
      case _enum.Rocket:
        return props.explode();
      default: return;
    }
  }

  props.explode = function () {

    props.destroid = true;
    props.speed = { x: 0, y: 0 };

    let explosionIsDone = false;
    let emmiterIsDone = true;

    props.body.shape.radius = 0;
    props.container.removeChild(props.sprite);

    const particles = Emitter.create({
      assetPath: "assets/Stone/Stone_001.png",
      speed: { x: randFloatBet(2.0, 3.0), y: randFloatBet(1.0, 2.0), },
      particles: { min: 24, max: 32 },
    });

    particles.oncomplete = function () {
      emmiterIsDone = true;
      if (explosionIsDone && emmiterIsDone) props.restart();
    };

    props.container.addChild(particles.container);

    const explosion = props.animations.get('explosion');
    explosion.anchor.set(0.5);
    explosion.animationSpeed = 4 / 60;

    explosion.onComplete = function () {
      explosionIsDone = true;
      props.container.removeChild(explosion);
      if (explosionIsDone && emmiterIsDone) props.restart();
    };

    props.container.addChild(explosion);
    props.animations.play('explosion', { loop: false });

  }

  props.restart = function () {
    props.destroid = false;
    props.speed = speed;

    if (props.body) {
      props.body.shape.radius = 16;
    }

    props.x = randFloatBet(MIN_X, MAX_X);
    props.y = MIN_Y;
    props.z = z;

    props.container.position.set(props.x, props.y);
    props.container.addChild(props.sprite);

  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;

}

