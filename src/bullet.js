import _enum from './enum';

import * as Animations from './animations';
import * as CollisionBody from './collision/body';

import { Container, Sprite, Texture } from 'pixi.js';
import app from './app';

const images = {
  bullet: "assets/Bullet/MainBullet.png",
  explosion: [
    "assets/Explosion/Explosion2_001.png",
    "assets/Explosion/Explosion2_002.png",
    "assets/Explosion/Explosion2_003.png",
    "assets/Smoke/Smoke_001.png",
    "assets/Smoke/Smoke_002.png",
    "assets/Smoke/Smoke_003.png",
    "assets/Smoke/Smoke_004.png",
    "assets/Smoke/Smoke_005.png",
    "assets/Smoke/Smoke_006.png",
    "assets/Smoke/Smoke_007.png",
    "assets/Smoke/Smoke_008.png",
  ],
}

export function create({
  x, y, scale = 1,
}) {
  const props = {
    x, y, scale,
    label: _enum.Bullet,
    speed: { x: 0, y: 2 },
    dir: { x: 0, y: -1 },
    width: 32, height: 32,
    sprite: null,
    exploded: false,
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    body: null,
    animations: Animations.create(),
  };

  props.start = function(){
    props.container = new Container();
    props.body = CollisionBody.create(props, { radius: 4 });

    props.sprite = new Sprite(Texture.from(images.bullet));
    props.sprite.anchor.set(0.5);
    props.container.addChild(props.sprite);
    props.animations.add('explosion', images.explosion);

    props.container.position.set(x, y);

  }

  props.update = function(delta) {
    if (!props.exploded) {
      props.x += props.dir.x * delta * props.speed.x;
      props.y += props.dir.y * delta * props.speed.y;

      props.container.position.set(props.x, props.y);

      if (props.speed.y + 0.3 <= 6) {
        props.speed.y += 0.3;
      }

      if (props.y - app.stage.pivot.y - props.height / 2 <= 0) {
        props.destroy();
      }
    }
  }

  props.oncollide = function(col) {
    switch(col.label) {
      case _enum.Bullet:
      case _enum.Player:
        break;
      default:
        const explosion = props.animations.play('explosion', { loop: false });

        explosion.animationSpeed = 12 / 60;
        explosion.anchor.set(0.5);
        explosion.scale.set(1, 1);

        props.exploded = true;
        props.body.shape.radius = 0;

        explosion.onComplete = () => {
          props.destroy();
        };

        props.container.removeChild(props.sprite);

        props.container.addChild(explosion);
      return;
    }
  }

  props.destroy = function() {
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
