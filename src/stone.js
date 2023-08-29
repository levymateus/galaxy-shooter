
import app from "./app";

import { Sprite, Texture } from "pixi.js";
import { rng } from "./utils";

export function create({ x, y, speed = { x: 1, y: 1 }, container }){

  const props = {
    x, y,
    speed: { ...speed   },
    start: null,
    update: null,
    sprite: null,
    container: container,
  };

  props.start = function() {
    props.sprite = new Sprite(Texture.from(`assets/Asteroid/Asteroid_00${rng(5, 6)}.png`));
    props.sprite.x = props.x;
    props.sprite.y = props.y;
    props.sprite.angle = rng(0, 360);
    props.sprite.anchor.set(0.5);
    props.container.addChild(props.sprite);
  }

  props.update = function(delta) {
    props.sprite.angle += delta * props.speed.x;
  }

  props.start();
  props.container.addChild(props.container);
  app.ticker.add(props.update);

}


