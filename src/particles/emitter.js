import app from "../app";

import * as Particle from "./particle";

import { Container } from "pixi.js";
import { randomFloat, randomInt } from "../utils";

export function create({
  frequency = 0,
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
    step: 0.01,
  },
  scale = {
    step: 0.01,
  },
  angle = {
    step: 2,
  },
  assetPath = "",
}) {

  let timer = 0;
  let count = randomInt(particles.min, particles.max);

  const props = {
    frequency,
    start: null,
    update: null,
    destroy: null,
    container: null,
    oncomplete: null,
    particles: [],
  };

  props.start = function () {
    props.container = new Container();
    props.container.x = position.x;
    props.container.y = position.y;

    if (!props.frequency) {
      spawn(count);
    }
  }

  function spawn(n) {
    for (let i = 0; i < n; i++) {
      const p = Particle.create({
        assetPath,
        container: props.container,
        scale: 2,
        dir: {
          x: randomFloat(-1, 1),
          y: randomFloat(-1, 1),
        }
      });
      props.particles.push(p);
    }
  }

  props.update = function (delta) {

    if (props.frequency && timer >= props.frequency && count) {
      spawn(1);
      count -= 1;
      timer = 0;
    }

    props.particles.forEach((p, index) => {
      p.x += p.speed.x * p.dir.x * delta;
      p.y += p.speed.y * p.dir.y * delta;
      p.alpha -= alpha.step;
      p.scale -= scale.step;
      p.angle += angle.step;

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

  props.destroy = function (index) {
    props.particles.splice(index, 1);
    if (props.particles.length <= 0) {
      props.oncomplete();
      app.stage.removeChild(props.container);
      props.container.removeChildren();
      props.container.destroy();
      app.ticker.remove(props.update);
    }
  }

  props.start();
  app.stage.addChild(props.container);
  app.ticker.add(props.update);

  return props;
}

