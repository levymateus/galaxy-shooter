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
  x, y, scale = 1,
}) {
  const props = {
    x, y, scale,
    label: _enum.Rocket,
    speed: { x: 0, y: 3 },
    dir: { x: 0, y: -1 },
    width: 32, height: 32,
    body: null,
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
    props.body = CollisionBody.create(props, { radius: 8 });

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
    if (props.exploded) return

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

  props.oncollide = function(col) {
    if (props.exploded) return
    switch(col.label) {
      case _enum.Asteroid:
        const explosion = props.animations.play('explosion', { loop: false });
        explosion.animationSpeed = 12 / 60;
        explosion.anchor.set(0.5);
        explosion.scale.set(0.7, 0.7);
        explosion.onComplete = () => {
          props.destroy();
        }
        props.exploded = true;
        props.container.removeChild(
          props.animations.get('rocket'),
        );
        props.container.addChild(explosion);
      default:
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
