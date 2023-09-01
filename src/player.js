import uuid from './uuid';
import _enum from './enum';

import * as Animations from './animations';
import * as Keyboard from './keyboard';
import * as Gun from './gun';
import * as Timer from './timer';
import * as Shield from './shield';
import * as Power from './power';
import * as CollisionBody from './collision/body';

import { Container, Sprite, Texture } from 'pixi.js';
import app, { MIN_X, MAX_X } from './app';

const images = {
  sprite: "assets/MainShip/MainShip.png",
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
  x, y, z = 0, scale = 1,
  collidesWith = [_enum.Asteroid],
}) {

  let lastColliderId = '';

  const props = {
    id: uuid(),
    x, y, z, scale,
    width: 32, height: 32,
    label: _enum.Player,
    dead: false,

    speed: { x: 3, y: 3 },

    weapons: {
      active: null,
      left: null,
      right: null,
      center: null,
    },

    attributes: {
      damage: 100,
      health: 100,
    },

    state: '',

    cd: null,
    sprite: null,
    shield: null,
    body: null,
    power: null,
    start: null,
    update: null,
    flick: null,
    destroy: null,
    oncollide: null,
    container: null,

    animations: Animations.create(),
  };

  props.start = function () {
    props.container = new Container();
    props.body = CollisionBody.create(props);

    props.sprite = new Sprite(Texture.from(images.sprite));
    props.sprite.anchor.set(0.5);
    props.container.addChild(props.sprite);

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

    props.weapons.left = Gun.create({
      x, y,
      label: 'shoot-left',
      type: 'bullet',
      cd: 150,
      count: 100
    });
    props.weapons.right = Gun.create({
      x, y,
      label: 'shoot-right',
      type: 'bullet',
      cd: 150,
      count: 100
    });
    props.weapons.center = Gun.create({
      x, y,
      label: 'shoot-center',
      type: 'rocket',
      cd: 250,
      count: 100
    });
    props.weapons.active = props.weapons.left;

    props.shield = Shield.create({
      health: 100,
      cd: 1000,
      container: props.container
    });

    props.power = Power.create({
      range: props.width,
      container: props.container,
    });

    props.cd = Timer.countdown(0);

    props.container.position.set(props.x, props.y);
    app.stage.pivot.x = props.x - app.view.width / 2;
    app.stage.pivot.y = props.y - app.view.height + 64;

    props.flick(3000);

  }

  props.update = function (delta) {

    if (Keyboard.isKeyDown('d') && props.x + 16 <= MAX_X && props.state.value !== 'dead') {
      props.x += props.speed.x * delta;
      props.container.x = props.x;
    }

    if (Keyboard.isKeyDown('a') && props.x - 16 >= MIN_X && props.state.value !== 'dead') {
      props.x -= props.speed.x * delta;
      props.container.x = props.x;
    }

    if (Keyboard.isKeyDown('w') && props.y - 80 >= 0 && props.state.value !== 'dead') {
      props.y -= props.speed.y * delta;
      props.container.y = props.y;
    }

    if (Keyboard.isKeyDown('s') && props.y - 48 <= app.view.height && props.state.value !== 'dead') {
      props.y += props.speed.y * delta;
      props.container.y = props.y;
    }

    if (Keyboard.isKeyDown(' ') && props.cd.done && props.state.value !== 'dead') {
      props.shoot(props.weapons.active, props.weapons.active.label);
      props.weapons.active = props.weapons.active.label === 'shoot-left'
      ? props.weapons.right
      : props.weapons.left;
      props.cd.start(350);
    } else if (Keyboard.isKeyDown('r') && props.cd.done && props.state.value !== 'dead') {
      props.weapons.center.shoot();
      props.cd.start(850);
    }

    if (Keyboard.isKeyDown('u')) {
      props.shield.activate();
    }

    if (Keyboard.isKeyDown('p')) {
      props.power.activate();
    }


    if (props.x - app.view.width / 2 >= MIN_X && props.x + app.view.width / 2 <= MAX_X) {
      app.stage.pivot.x = props.x - app.view.width / 2;
    }

    props.weapons.left.x = props.x - 12;
    props.weapons.left.y = props.y - 16;
    props.weapons.right.x = props.x + 12;
    props.weapons.right.y = props.y - 16;
    props.weapons.center.x = props.x;
    props.weapons.center.y = props.y - 16;

  }

  props.oncollide = function (collisor) {
    if (props.dead) return
    if (props.state === 'immune') return
    if (lastColliderId === collisor.body.id) return
    if (!collidesWith.includes(collisor.label)) return
    if (props.shield.up) return

    props.attributes.health -= collisor.attributes.damage;
    
    const isDead = props.dead || props.attributes.health <= 0;

    if (isDead) {
      props.dead = true;
      props.speed = { x: 0, y: 0, z: 0 };
      props.destroy();
    }

    lastColliderId = collisor.body.id;
  }

  props.shoot = function(gun, animation) {
    if (gun.shoot()) {
      const anim = props.animations.get(animation);
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

  props.flick = function(ms) {
    props.state = 'immune';
    props.body.shape.radius = 0;
    props.z = 1;
    const counter = Timer.interval(ms / 10, () => {
      props.container.alpha = props.container.alpha ? 0 : 1;
      Timer.timeout(ms, () => {
        props.container.alpha = 1;
        props.body.shape.radius = 16;
        props.state = '';
        props.z = 0;
        counter.stop();
      }).start();
    });
    counter.start();
  }

  props.destroy = function () {
    const anim = props.animations.get('dead');
    anim.animationSpeed = 4 / 60;
    anim.anchor.set(0.5);

    anim.onComplete = () => {
      props.container.removeChildren();
      props.container.destroy();
      app.stage.removeChild(props.container);
      app.ticker.remove(props.update);
    };

    props.body.remove();
    props.container.removeChildren();
    props.container.addChildAt(anim, 0);
    props.animations.play('dead', { loop: false });
  };

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}
