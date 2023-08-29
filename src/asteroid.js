import app, { MAX_X, MIN_X } from "./app";

import * as Animations from "./animations";
import * as Keyboard from './keyboard';
import * as Stone from "./stone";

import { Container } from "pixi.js";
import { randomFloat, rng } from "./utils";

const images = [
  [
    "assets/Asteroid/Asteroid_001.png",
  ],
  [
    "assets/Asteroid/Asteroid_002.png",
  ],
  [
    "assets/Asteroid/Asteroid_003.png",
  ],
  [
    "assets/Asteroid/Asteroid_004.png",
  ],
  [
    "assets/Asteroid/Asteroid_005.png",
  ],
  [
    "assets/Asteroid/Asteroid_006.png"
  ],
  [
    "assets/Asteroid/Asteroid_007.png"
  ]
]

export function create({ x, y, z, index = 0, speed = { x: 0, y: 1 } }){

  const initialSpeed = { ...speed };
  const props = {
    index,
    x, y, z,
    speed,
    dir: { x: 0, y: 1 },
    container: null,
    start: null,
    update: null,
    destroy: null,
    animations: null,
    spawnFragments: null,
  };

  props.start = function() {
    props.container = new Container();
    props.animations = Animations.create();

    const anim = props.animations.add(`asteroid${props.index+1}`, images[props.index]);
    anim.angle = randomFloat(0, 60);
    anim.anchor.set(0.5);
    anim.animationSpeed = 8 / 60;

    props.container.x = x;
    props.container.y = y;
    props.container.z = z;

    props.container.addChild(anim);

    for (let i = 0; i <= rng(0, 2); i += 1) {
      Stone.create({
        x: rng(-64, 64),
        y: rng(-64, 64),
        container: props.container,
        speed: { y: 0, x: randomFloat(0.1, 0.8)
        }
      });
    }

    props.animations.play(`asteroid${props.index + 1}`);
  }

  props.update = function(delta) {
    const anim = props.animations.get(`asteroid${props.index+1}`).sprite;

    anim.angle += 0.01 * delta * props.speed.y;
    props.x += props.speed.x * delta * props.dir.x;
    props.y += props.speed.y * delta * props.dir.y;

    props.container.x = props.x;
    props.container.y = props.y;
    props.container.z = props.z

    if (Keyboard.isKeyDown('w') && props.speed.y <= initialSpeed.y * 4) {
      props.speed.y += 0.2;
    }

    if (Keyboard.isKeyDown('s') && props.speed.y - 0.02 >= initialSpeed.y) {
      props.speed.y -= 0.02;
    } else if (props.speed.y - 0.018 >= initialSpeed.y) {
      props.speed.y -= 0.018;
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

