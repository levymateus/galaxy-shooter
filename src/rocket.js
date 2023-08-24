import * as Animations from './animations';

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
  x, y, scale = 1,
}) {
  const props = {
    x, y, scale,
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
    const def = props.animations.add('rocket', images.rocket);
    props.animations.add('explosion', images.explosion);

    def.anchor.set(0.5);
    def.animationSpeed = 8 / 60;

    props.animations.play('rocket');

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

      if (props.speed.y + 0.4 <= 4) {
        props.speed.y += 0.4;
      }

      if (props.y <= 0) {
        props.destroy();
      }
    }
  }

  props.oncollide = function() {
    const explosion = props.animations.play('explosion', { loop: false });
    explosion.animationSpeed = 12 / 60;
    explosion.anchor.set(0.5);
    explosion.scale.set(0.7, 0.7);
    explosion.onComplete = () => {
      props.destroy();
    }
    props.exploded = true;
    props.container.removeChildAt(0);
    props.container.addChildAt(explosion, 0);
  }

  props.destroy = function() {
    props.container.removeChildren();
    props.container.destroy();
    app.ticker.remove(props.update);
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}
