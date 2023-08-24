import uuid from './uuid';

import * as Animations from './animations';
import * as Keyboard from './keyboard';
import * as Observervable from './observable';
import * as Bullet from './bullet';

import { Container } from 'pixi.js';
import app from './app';

const images = {
  idle: [
    "assets/MainShip/MainShip.png",
  ],
  explosion: [
    "assets/Explosion/Explosion_001.png",
    "assets/Explosion/Explosion_002.png",
    "assets/Explosion/Explosion_003.png",
    "assets/Explosion/Explosion_004.png",
  ],
  engine: [
    "assets/Fire/Fire_001.png",
    "assets/Fire/Fire_002.png",
    "assets/Fire/Fire_003.png",
  ]
}

export function create({
  x, y, key = 'Player', scale = 1
}) {
  const props = {
    id: uuid(),
    x, y, scale, key,
    type: 'rect',
    speed: { x: 3, y: 3 },
    width: 32, height: 32,
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    countdown: 0,
    weapon: 'left',
    bullets: Observervable.create(10),
    health: Observervable.create(5),
    animations: Animations.create(),
    state: Observervable.create('idle'),
  };

  props.start = function () {
    const idle = props.animations.add('idle', images.idle);
    const engine = props.animations.add('engine', images.engine);

    engine.animationSpeed = 8 / 60;
    engine.y += 14;
    engine.play();

    props.animations.add('dead', images.explosion);

    props.animations.play(props.state.value);

    props.container = new Container();
    props.container.addChild(idle);
    props.container.addChild(engine);

    props.container.x = x;
    props.container.y = y;

    props.state.listen((prevState, newState) => {
      if (prevState === newState) return;
      switch(newState) {
        case 'dead':
          props.destroy();
          break;
        default:
          break;
      }
    });

    props.health.listen((prevState, newState) => {
      if (prevState !== newState && newState <= 0) {
        props.state.set('dead');
      }
    });

  }

  props.update = function (delta) {

    if (Keyboard.isKeyDown('d') && props.state.value !== 'dead') {
      props.x += props.speed.x * delta;
      props.container.x = props.x;
    }
    if (Keyboard.isKeyDown('a') && props.state.value !== 'dead') {
      props.x -= props.speed.x * delta;
      props.container.x = props.x;
    }
    if (Keyboard.isKeyDown('w') && props.state.value !== 'dead') {
      props.y -= props.speed.y * delta;
      props.container.y = props.y;
    }
    if (Keyboard.isKeyDown('s') && props.state.value !== 'dead') {
      props.y += props.speed.y * delta;
      props.container.y = props.y;
    }

    if (Keyboard.isKeyDown(' ') && props.countdown <= 0) {
      if (props.weapon === 'left') {
        Bullet.create({ x: props.x - 12, y: props.y - 20 });
        props.weapon = 'right';
        props.countdown = 10;
      } else {
        Bullet.create({ x: props.x + 12, y: props.y - 20 });
        props.weapon = 'left';
        props.countdown = 20;
      }
    }

    if (props.countdown - delta > 0) {
      props.countdown -= delta;
    } else {
      props.countdown = 0;
    }
  }

  props.oncollide = function () {

  }

  props.destroy = function () {
    const explosion = props.animations.play('dead', { loop: false });
    explosion.animationSpeed = 4 / 60;
    explosion.onComplete = () => {
      props.container.removeChildren();
      props.container.destroy();
      app.ticker.remove(props.update);
    }
    props.container.removeChildAt(0);
    props.container.addChildAt(explosion, 0);
  };

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}
