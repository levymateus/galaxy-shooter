import app, { MAX_X, MIN_X, MIN_Y } from "./app";
import _enum from "./enum";

import * as Animations from "./animations";
import * as CollisionBody from "./collision/body";
import * as Keyboard from './keyboard';
import * as Emitter from "./particles/emitter";
import * as Stone from "./stone";
import * as Timer from './timer';

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
  x, y, z = 0, isStatic = false, speed = { x: 0, y: 1 },
  collidesWith = [_enum.Player, _enum.Bullet, _enum.Rocket],
}) {

  const initialSpeed = { ...speed };
  let lastColliderId = '';

  const props = {
    x, y, z, speed,
    label: _enum.Asteroid,
    static: isStatic,

    dead: false,

    dir: { x: 0, y: 1 },

    attributes: {
      damage: 100,
      health: 1,
    },

    angle: 0,
    body: null,
    start: null,
    restart: null,
    update: null,
    sprite: null,
    flick: null,
    explode: null,
    destroy: null,
    oncollide: null,
    container: null,
    animations: null,
  };

  props.start = function () {

    props.attributes.health = randIntBet(2, 6);
    props.container = new Container();
    props.container.position.set(x, y);
    props.angle = randFloatBet(0, 1)

    props.body = !props.static ? CollisionBody.create(props) : null;

    props.animations = Animations.create();
    props.animations.add('explosion', images.explosion);

    if (props.static) {
      props.sprite = new Sprite(Texture.from(images.sprites[randIntBet(0, 4)]));

      for (let i = 0; i <= randIntBet(0, 2); i += 1) {
        Stone.create({
          x: randIntBet(-64, 64),
          y: randIntBet(-64, 64),
          z: -1,
          container: props.container,
          speed: { y: 0, x: randFloatBet(0.1, 0.8) }
        });
      }
    }

    if (!props.static) {
      props.sprite = new Sprite(Texture.from(images.sprites[5]));
      props.speed = { x: 0, y: randFloatBet(1, 2), z: 0 };
    }

    props.sprite.anchor.set(0.5);
    props.sprite.angle = randFloatBet(0, 360);
    props.container.addChild(props.sprite);
  }

  props.update = function (delta) {
    props.sprite.angle += delta * props.speed.y * props.angle;

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

  props.oncollide = function (collisor) {
    if (props.dead) return
    if (!collidesWith.includes(collisor.label)) return
    if (lastColliderId === collisor.body.id) return

    props.attributes.health -= collisor.attributes.damage;

    if (props.attributes.health <= 0) {
      props.explode();
    }

    lastColliderId = collisor.body.id;
  }

  props.explode = function () {

    props.z = -1;
    props.dead = true;
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
    props.dead = false;
    props.speed = { x: 0, y: randFloatBet(1, 2) };

    if (props.body) {
      props.body.shape.radius = 16;
      props.z = 0;
    }

    props.x = randFloatBet(MIN_X, MAX_X);
    props.y = MIN_Y;

    props.container.position.set(props.x, props.y);
    props.container.addChild(props.sprite);

    if (!props.static)
      props.flick(2000);

  }

  props.flick = function (ms) {
    const counter = Timer.interval(ms / 10, () => {
      props.container.alpha = props.container.alpha ? 0 : 1;
      Timer.timeout(ms, () => {
        props.container.alpha = 1;
        counter.stop();
      }).start();
    });
    counter.start();
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;

}

