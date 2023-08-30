import app from "./app";

import * as Timer from "./timer";
import * as Animation from "./animations";

import { Container } from "pixi.js";

const images = {
  shield: [
    "assets/Shield/Shield_001.png",
    "assets/Shield/Shield_002.png",
    "assets/Shield/Shield_003.png",
    "assets/Shield/Shield_004.png",
    "assets/Shield/Shield_005.png",
  ]
}

export function create({ health = 10, cd, container }) {
  const props = {
    health,
    up: false,
    cd: null,
    start: null,
    update: null,
    destroy: null,
    activate: null,
    oncollide: null,
    container: null,
    animations: null,
  };

  props.start = function() {
    props.container = new Container();
    props.cd = Timer.countdown(cd);
    props.animations = Animation.create();
    props.animations.add('shield', images.shield);
  }

  props.activate = function() {
    const anim = props.animations.get('shield');

    if (anim.playing || !props.cd.done || props.up) {
      return
    }

    props.up = true;

    anim.alpha = 0.8;
    anim.animationSpeed = 8 / 60;
    anim.scale.set(1.5, 1.5);
    anim.anchor.set(0.5);

    props.container.addChild(anim);
    container.addChild(props.container);
    props.animations.play('shield', { loop: true });

    Timer.timeout(cd, () => {

      props.up = false;

      anim.gotoAndStop(0);
      props.container.removeChild(anim);

      props.cd.start(cd);
    }).start()
  }

  props.update = function() {

  }

  props.oncollide = function() {

  }

  props.destroy = function() {

  }

  props.start();
  app.ticker.add(props.update);

  return props;
}
