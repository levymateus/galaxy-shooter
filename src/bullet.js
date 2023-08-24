import * as Animations from './animations';

import { Container } from 'pixi.js';
import app from './app';

const images = {
  default: [
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
  x, y, key = 'Bullet', scale = 1,
}) {
  const props = {
    x, y, scale, key,
    type: 'rect',
    speed: { x: 0, y: 3 },
    dir: { x: 0, y: -1 },
    width: 8, height: 8,
    exploded: false,
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    animations: Animations.create(),
  };

  props.start = function(){
    const def = props.animations.add('default', images.default);
    props.animations.add('explosion', images.explosion);

    def.animationSpeed = 8 / 60;

    props.animations.play('default');

    props.container = new Container();
    props.container.addChild(def);

    props.container.x = x;
    props.container.y = y;

  }

  props.update = function(delta) {
    if (!props.exploded) {
      props.x += props.dir.x * delta * props.speed.x;
      props.y += props.dir.y * delta * props.speed.y;

      props.container.x = props.x;
      props.container.y = props.y;

      if (props.speed.y + 0.1 <= 8) {
        props.speed.y += 0.1;
      }

      if (props.y <= 32) {
        props.destroy();
      }
    }
  }

  props.oncollide = function() {

  }

  props.destroy = function() {
    const explosion = props.animations.play('explosion', { loop: false });
    explosion.animationSpeed = 12 / 60;
    explosion.scale.set(0.7, 0.7);
    explosion.onComplete = () => {
      props.container.removeChildren();
      props.container.destroy();
      app.ticker.remove(props.update);
    }
    props.exploded = true;
    props.container.removeChildAt(0);
    props.container.addChildAt(explosion, 0);
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}
