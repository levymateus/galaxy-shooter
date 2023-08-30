import app, { MAX_X, MIN_X, MIN_Y } from "./app";
import _enum from "./enum";

import * as Animations from "./animations";
import * as CollisionBody from "./collision/body";
import * as Keyboard from './keyboard';
import * as Emitter from "./particles/emitter";
import * as Stone from "./stone";

import { Container } from "pixi.js";
import { randomFloat, randomInt } from "./utils";

const images = {
  'Asteroid_001': [
    "assets/Asteroid/Asteroid_001.png",
  ],
  'Asteroid_002': [
    "assets/Asteroid/Asteroid_002.png",
  ],
  'Asteroid_003': [
    "assets/Asteroid/Asteroid_003.png",
  ],
  'Asteroid_004': [
    "assets/Asteroid/Asteroid_004.png",
  ],
  'Asteroid_005': [
    "assets/Asteroid/Asteroid_005.png",
  ],
  'Asteroid_006': [
    "assets/Asteroid/Asteroid_006.png"
  ],
  'Asteroid_outline_006': [
    "assets/Asteroid/Asteroid_outline_006.png",
  ],
  explosion: [
    "assets/Explosion/Explosion_001.png",
    "assets/Explosion/Explosion_002.png",
    "assets/Explosion/Explosion_003.png",
    "assets/Explosion/Explosion_004.png",
  ],
}

export function create({ x, y, z = -1, name = null, speed = { x: 0, y: 1 } }) {

  let collision = null;
  const initialSpeed = { ...speed };

  const props = {
    x, y, z, speed, name,
    destroid: false,
    label: _enum.Asteroid,
    dir: { x: 0, y: 1 },
    body: null,
    start: null,
    reset: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    animations: null,
  };

  props.start = function () {
    props.container = new Container();

    const keys = Object.entries(images);
    const keysCount = Object.keys(images).filter(key => !key.includes('outline')).length - 1;

    props.name = !name
      ? keys[randomInt(0, keysCount)][0]
      : name;

    props.body = props.name.includes('outline')
      ? CollisionBody.create(props)
      : null;

    // animation --------------
    props.animations = Animations.create();
    const animation = props.animations.add(props.name, images[props.name]);
    animation.angle = randomFloat(0, 60);
    animation.anchor.set(0.5);
    animation.animationSpeed = 8 / 60;

    props.animations.add('explosion', images.explosion);

    props.container.x = x;
    props.container.y = y;
    props.container.z = z;

    props.container.addChild(animation);
    props.animations.play(props.name);

    if (props.body) {
      animation.scale.set(randomFloat(1.0, 1.5));
      props.speed.x = 0;
      props.speed.y = randomFloat(1.3, 2.5);
    }

    if (!props.body) {
      for (let i = 0; i <= randomInt(0, 2); i += 1) {
        Stone.create({
          x: randomInt(-64, 64),
          y: randomInt(-64, 64),
          container: props.container,
          speed: { y: 0, x: randomFloat(0.1, 0.8) }
        });
      }
    }

  }

  props.update = function (delta) {
    const anim = props.animations.get(props.name);

    anim.angle += 0.1 * delta * props.speed.y;
    props.x += props.speed.x * delta * props.dir.x;
    props.y += props.speed.y * delta * props.dir.y;

    props.container.x = props.x;
    props.container.y = props.y;
    props.container.z = props.z

    if (!props.body) {
      if (Keyboard.isKeyDown('w') && props.speed.y <= initialSpeed.y * 4) {
        props.speed.y += 0.2;
      }

      if (Keyboard.isKeyDown('s') && props.speed.y - 0.02 >= initialSpeed.y) {
        props.speed.y -= 0.02;
      } else if (props.speed.y - 0.018 >= initialSpeed.y) {
        props.speed.y -= 0.018;
      }
    }

    if (props.y >= app.view.height + app.stage.pivot.y + 32) {
      props.reset();
    }
  }

  props.oncollide = function (col) {
    if (props.destroid) return;
    switch(col.label) {
      case _enum.Player:
      case _enum.Bullet:
      case _enum.Rocket:
        props.destroy();
        break;
      default: return;
    }
  }

  props.destroy = function () {

    props.destroid = true;
    props.speed = { x: 0, y: 0 };

    let explosionIsDone = false;
    let emmiterIsDone = true;

    props.container.removeChild(props.animations.get(props.name));

    // particles -------------
    const particles = Emitter.create({
      assetPath: "assets/Stone/Stone_001.png",
      speed: { x: randomFloat(2, 3), y: randomFloat(1, 2), },
      particles: { min: 24, max: 32 },
    });

    particles.oncomplete = function () {
      emmiterIsDone = true;
      if (explosionIsDone && emmiterIsDone)
        props.reset();
    }

    props.container.addChild(particles.container);

    // explosion -------------
    const explosion = props.animations.get('explosion');
    explosion.anchor.set(0.5);
    explosion.animationSpeed = 4 / 60;

    explosion.onComplete = function () {
      explosionIsDone = true;
      props.container.removeChild(explosion);
      if (explosionIsDone && emmiterIsDone)
        props.reset();
    }

    props.container.addChild(explosion);
    props.animations.play('explosion', { loop: false });

  }

  props.reset = function() {
    props.destroid = false;
    props.speed = speed;

    props.x = randomFloat(MIN_X, MAX_X);
    props.y = MIN_Y;
    props.z = z;

    props.container.x = props.x;
    props.container.y = props.y;
    props.container.z = props.z;

    props.container.addChild(props.animations.get(props.name));

  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;

}

