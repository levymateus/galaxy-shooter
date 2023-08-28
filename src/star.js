import app, { MAX_X, MIN_X } from "./app";

import * as Animation from "./animations";
import * as Keyboard from './keyboard';

import { Container } from "pixi.js";
import { randomFloat } from "./utils";

const images = [
  ["assets/Star/Star_001.png"],
  ["assets/Star/Star_004.png"],
  ["assets/Star/Star_007.png"],
  ["assets/Star/Star_010.png"],
  ["assets/Star/Star_002.png"],
];

export function create({ x, y, z, index = 0, speed = { x: 0, y: 1 } }){

  const initialSpeed = { ...speed };
  const props = {
    x, y, z,
    index,
    speed: { ...speed },
    dir: { x: 0, y: 1 },
    start: null,
    update: null,
    destroy: null,
    container: null,
    animations: null,
  };

  props.start = function() {
    props.container = new Container();
    props.animations = Animation.create();

    const anim = props.animations.add(`star${props.index + 1}`, images[props.index]);
    anim.animationSpeed = 1 / 60;
    anim.aplha = 0.8;
    props.container.addChild(anim);
    anim.play();

    props.container.x = x;
    props.container.y = y;
    props.container.z = z;
  }

  props.update = function(delta) {
    props.x += props.speed.x * delta * props.dir.x;
    props.y += props.speed.y * delta * props.dir.y;
    props.z = 0;

    props.container.x = props.x;
    props.container.y = props.y;
    props.container.z = z;

    if (Keyboard.isKeyDown('w') && props.speed.y <= initialSpeed.y * 12) {
      props.speed.y += 0.2;
    }

    if (Keyboard.isKeyDown('s') && props.speed.y - 0.02 >= initialSpeed.y) {
      props.speed.y -= 0.02;
    } else if (props.speed.y - 0.018 >= initialSpeed.y) {
      props.speed.y -= 0.018;
    }

    if (props.y >= app.view.height + app.stage.pivot.y) {
      props.x = randomFloat(MIN_X, MAX_X);
      props.y = 0;
      props.container.x = props.x;
      props.container.y = props.y;
    }
  }

  props.destroy = function () {
    props.container.removeChildren();
    props.container.destroy();
    app.ticker.remove(props.update);
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

}
