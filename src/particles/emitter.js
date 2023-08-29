import app from "../app";

import * as Particle from "./particle";

import { Container } from "pixi.js";
import { randomFloat, rng } from "../utils";

export function create({
  particles = {
    min: 1,
    max: 3,
  },
  position = {
    x: 0, y: 0
  },
  alpha = {
    min: 0.4,
    max: 1,
  },
  assetPath = "",
}){

  let timer = 0;
  const props = {
    start: null,
    update: null,
    destroy: null,
    container: null,
    oncomplete: null,
    count: rng(particles.min, particles.max),
    particles: [],
  };

  props.start = function() {
    props.container = new Container();
    props.container.x = position.x;
    props.container.y = position.y;
  }

  props.update = function(delta) {

    if (timer >= 1 && props.count) {
      const p = Particle.create({
        assetPath,
        container: props.container,
        scale: 1.5,
        dir: {
          x: randomFloat(-1, 1),
          y: randomFloat(-1, 1),
        }
      });
      props.particles.push(p);
      props.count -= 1;
      timer = 0;
    }

    props.particles.forEach((p, index) => {
      p.x += p.speed.x * p.dir.x * delta;
      p.y += p.speed.y * p.dir.y * delta;
      p.alpha -= 0.01;
      p.scale -= 0.01;
      p.angle += 2;

      p.sprite.x = p.x;
      p.sprite.y = p.y;
      p.sprite.angle = p.angle;
      p.sprite.alpha = p.alpha;
      p.sprite.scale.set(p.scale, p.scale);

      if (p.alpha <= alpha.min) {
        props.destroy(index);
      }
    });

    timer += delta;
  }

  props.destroy = function(index) {
    props.particles.splice(index, 1);
    if (props.particles.length <= 0) {
      props.oncomplete();
      console.log('destroy particles');
      props.container.removeChildren();
      props.container.destroy();
    }
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}

