
import * as Animation from "./animations";
import * as Timer from "./timer";

import { Container } from 'pixi.js';
import { randomInt } from "./utils";

const images = {
  lightning001: [
    "assets/Lightning/Lightning001/Lightning_001.png",
    "assets/Lightning/Lightning001/Lightning_002.png",
    "assets/Lightning/Lightning001/Lightning_003.png",
  ]
}

export function create({ x = 0, y = 0, range = 32, cd = 500, container }) {

  const props = {
    up: false,
    cd: null,
    start: null,
    update: null,
    activate: null,
    container: null,
    animations: null,
  };

  props.start = function () {
    props.container = new Container();
    props.animations = Animation.create();
    props.cd = Timer.countdown(cd, () => {
      props.up = false;
    });
    props.animations.add('lightning001', images.lightning001);
  }

  props.update = function () {

  }

  props.activate = function () {
    const anim = props.animations.get('lightning001');

    if (anim.playing || !props.cd.done || props.up) {
      return
    }

    props.up = true;

    anim.x = x + randomInt(-range / 2, range / 2);
    anim.y = y + randomInt(-range / 2, range / 2);
    anim.alpha = 1;
    anim.angle = randomInt(0, 360);
    anim.animationSpeed = 24 / 60;
    anim.scale.set(1, 1);
    anim.anchor.set(0.5);

    anim.onComplete = () => {
      anim.x = x + randomInt(-range / 2, range / 2);
      anim.y = y + randomInt(-range / 2, range / 2);
      anim.angle += randomInt(0, 360);

      if (props.up) {
        anim.gotoAndPlay(0);
      } else {
        props.container.removeChild(anim);
        props.cd.start(cd * 2);
      }

    }

    props.container.addChild(anim);
    container.addChild(props.container);
    props.animations.play('lightning001', { loop: false });
    props.cd.start(cd);
  }

  props.start();

  return props;
}

