import * as Animations from './animations';

import { Container } from 'pixi.js';
import app from './app';

const images = {
  bullet: [
    "assets/Bullet/MainBullet.png",
  ],
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
    speed: { x: 0, y: 2 },
    dir: { x: 0, y: -1 },
    width: 32, height: 32,
    exploded: false,
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    initialPosition: { x, y },
    animations: Animations.create(),
  };

  props.start = function(){
    const def = props.animations.add('bullet', images.bullet);
    props.animations.add('explosion', images.explosion);

    def.anchor.set(0.5);
    def.animationSpeed = 8 / 60;

    props.animations.play('bullet');

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

      if (props.speed.y + 0.3 <= 6) {
        props.speed.y += 0.3;
      }

      if (props.y - app.stage.pivot.y - props.height / 2 <= 0) {
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
