import _enum from './enum';

import * as Animations from './animations';
import * as CollisionBody from './collision/body';

import { Container } from 'pixi.js';
import app from './app';

const images = {
  rocket: [
    "assets/Bullet/Bullet_001.png",
    "assets/Bullet/Bullet_002.png",
    "assets/Bullet/Bullet_003.png",
  ],
  explosion: [
    "assets/Explosion/Explosion_001.png",
    "assets/Explosion/Explosion_002.png",
    "assets/Explosion/Explosion_003.png",
    "assets/Explosion/Explosion_004.png",
  ],
}

export function create({
  x, y, z = 0, scale = 1,
  collidesWith = [_enum.Asteroid]
}) {
  const props = {
    x, y, z, scale,
    label: _enum.Rocket,
    width: 32, height: 32,
    dead: false,

    initialPosition: { x, y },

    speed: { x: 0, y: 3 },

    dir: { x: 0, y: -1 },

    attributes: {
      damage: 10,
      health: 1,
    },

    body: null,
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    explode: null,

    animations: Animations.create(),
  };

  props.start = function () {
    props.container = new Container();
    props.body = CollisionBody.create(props, { radius: 6 });

    const def = props.animations.add('rocket', images.rocket);
    props.animations.add('explosion', images.explosion);

    def.anchor.set(0.5);
    def.animationSpeed = 8 / 60;

    props.animations.play('rocket');

    props.container.addChild(def);

    props.container.x = x;
    props.container.y = y;

  }

  props.update = function (delta) {
    if (!props.dead) {
      props.x += props.dir.x * delta * props.speed.x;
      props.y += props.dir.y * delta * props.speed.y;

      props.container.x = props.x;
      props.container.y = props.y;

      if (props.speed.y + 0.4 <= 4) {
        props.speed.y += 0.4;
      }

      if (props.y - app.stage.pivot.y - props.height / 2 <= 0) {
        props.destroy();
      }
    }
  }

  props.oncollide = function (collisor) {
    if (props.dead) return
    if (!collidesWith.includes(collisor.label)) return

    props.attributes.health = 0;
    props.explode();
  }

  props.explode = function () {
    if (props.dead) return

    const explosion = props.animations.play('explosion', { loop: false });

    props.z = 3;
    props.dead = true;
    props.body.shape.radius = 0;

    explosion.animationSpeed = 12 / 60;
    explosion.anchor.set(0.5);
    explosion.scale.set(0.7, 0.7);


    explosion.onComplete = () => {
      props.destroy();
    }

    props.container.removeChild(
      props.animations.get('rocket'),
    );

    props.container.addChild(explosion);
  }

  props.destroy = function () {
    props.body.remove();
    app.stage.removeChild(props.container);
    props.container.removeChildren();
    props.container.destroy();
    app.ticker.remove(props.update);
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}
