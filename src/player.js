import uuid from './uuid';

import * as Animations from './animations';
import * as Keyboard from './keyboard';
import * as Observervable from './observable';
import * as Gun from './gun';
import * as Timer from './timer';
import * as Shield from './shield';

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
  shoot: [
    "assets/Explosion/Explosion2_001.png",
    "assets/Explosion/Explosion2_002.png",
    "assets/Explosion/Explosion2_003.png",
    "assets/Explosion/Explosion2_004.png",
    "assets/Explosion/Explosion2_005.png",
  ],
  engine: [
    "assets/Fire/Fire_001.png",
    "assets/Fire/Fire_002.png",
    "assets/Fire/Fire_003.png",
  ],
}

export function create({
  x, y, scale = 1
}) {
  const props = {
    id: uuid(),
    x, y, scale,
    speed: { x: 3, y: 3 },
    width: 32, height: 32,
    cd: null,
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    weapons: {
      active: null,
      left: null,
      right: null,
      center: null,
    },
    health: Observervable.create(5),
    animations: Animations.create(),
    state: Observervable.create('idle'),
  };

  props.start = function () {
    props.container = new Container();

    // animations ----------
    const idle = props.animations.add('idle', images.idle);
    idle.anchor.set(0.5);
    props.container.addChild(idle);
    props.animations.play('idle');

    const engine = props.animations.add('engine', images.engine);
    engine.y += 14;
    engine.anchor.set(0.5);
    engine.animationSpeed = 4 / 60;
    props.container.addChild(engine);
    props.animations.play('engine');

    const shootLeft = props.animations.add('shoot-left', images.shoot);
    shootLeft.x -= 12;
    shootLeft.y -= 16;

    const shootRight = props.animations.add('shoot-right', images.shoot);
    shootRight.x += 12;
    shootRight.y -= 16;

    props.animations.add('dead', images.explosion);
    // ----------------

    // weapons ---------
    props.weapons.left = Gun.create({
      x, y,
      label: 'shoot-left',
      type: 'bullet',
      cd: 10,
      count: 100
    });
    props.weapons.right = Gun.create({
      x, y,
      label: 'shoot-right',
      type: 'bullet',
      cd: 10,
      count: 100
    });
    props.weapons.center = Gun.create({
      x, y,
      label: 'shoot-center',
      type: 'rocket',
      cd: 30,
      count: 100
    });
    props.weapons.active = props.weapons.left;
    // -----------------

    // shield ---------
    props.shield = Shield.create({
      health: 100,
      cd: 100,
      container: props.container
    });
    //-----------------

    props.container.x = x;
    props.container.y = y;

    props.cd = Timer.countdown(10);

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

    if (Keyboard.isKeyDown(' ') && props.cd.done ) {
      props.shoot(props.weapons.active, props.weapons.active.label);
      props.weapons.active = props.weapons.active.label === 'shoot-left'
      ? props.weapons.right
      : props.weapons.left;
      props.cd.start(10);
    }

    if (Keyboard.isKeyDown('u')) {
      props.shield.activate();
    }

    if (Keyboard.isKeyDown('r') && props.state.value !== 'dead') {
      props.weapons.center.shoot();
      props.cd.start(20);
    }

    props.weapons.left.x = props.x - 12;
    props.weapons.left.y = props.y - 16;
    props.weapons.right.x = props.x + 12;
    props.weapons.right.y = props.y - 16;
    props.weapons.center.x = props.x;
    props.weapons.center.y = props.y - 16;

  }

  props.oncollide = function () {

  }

  props.shoot = function(gun, animation) {
    if (gun.shoot()) {
      const anim = props.animations.get(animation).sprite;
      if (!anim.playing) {
        anim.animationSpeed = 24 / 60;
        anim.scale.set(0.5, 0.5);
        anim.anchor.set(0.5);

        anim.onComplete = () => {
          props.container.removeChild(anim);
        }

        props.container.addChild(anim);
        props.animations.play(animation, { loop: false });
      }
    }
  }

  props.destroy = function () {
    const explosion = props.animations.get('dead').sprite;
    explosion.animationSpeed = 4 / 60;
    explosion.anchor.set(0.5);
    explosion.onComplete = () => {
      props.container.removeChildren();
      props.container.destroy();
      app.ticker.remove(props.update);
    }
    props.container.removeChildren();
    props.container.addChildAt(explosion, 0);
    props.animations.play('dead', { loop: false });
  };

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}
