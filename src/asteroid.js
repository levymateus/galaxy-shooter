import app, { MAX_X, MIN_X } from "./app";

import * as Animations from "./animations";
import * as Keyboard from './keyboard';
import * as Stone from "./stone";
import * as CollisionBody from "./collision/body";

import { Container } from "pixi.js";
import { randomFloat, rng } from "./utils";

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
  ]
}

export function create({ x, y, z = -1, name = null, speed = { x: 0, y: 1 } }){

  const initialSpeed = { ...speed };
  const props = {
    x, y, z,
    speed,
    name,
    body: null,
    dir: { x: 0, y: 1 },
    start: null,
    update: null,
    destroy: null,
    oncollide: null,
    container: null,
    animations: null,
  };

  props.start = function() {
    const keys = Object.entries(images)
    props.name = !name
      ? keys[rng(0, Object.keys(images)
          .filter(key => !key.includes('outline')).length - 1)][0]
      : name
    props.body = props.name.includes('outline')
      ? CollisionBody.create(props)
      : null;

    props.container = new Container();
    props.animations = Animations.create();

    const anim = props.animations.add(props.name, images[props.name]);
    anim.angle = randomFloat(0, 60);
    anim.anchor.set(0.5);
    anim.animationSpeed = 8 / 60;


    props.container.x = x;
    props.container.y = y;
    props.container.z = z;

    props.container.addChild(anim);

    if (props.body) {
      props.z = 0 ;
      anim.scale.set(randomFloat(1.0, 1.5));
      props.speed.x = 0;
      props.speed.y = randomFloat(1.3, 2.5);
    } else {

      for (let i = 0; i <= rng(0, 2); i += 1) {
        Stone.create({
          x: rng(-64, 64),
          y: rng(-64, 64),
          container: props.container,
          speed: { y: 0, x: randomFloat(0.1, 0.8) }
        });
      }
    }

    props.animations.play(props.name);
  }

  props.update = function(delta) {
    const anim = props.animations.get(props.name).sprite;

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
      props.x = randomFloat(MIN_X, MAX_X);
      props.y = 0;
      props.z = z;
      props.container.x = props.x;
      props.container.y = props.y;
      props.container.z = props.z
    }
  }

  props.oncollide = function(col) {
    // ...
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

