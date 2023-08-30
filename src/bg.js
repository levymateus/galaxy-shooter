import app, { MAX_X, MIN_X } from './app';

import * as Asteroids from './asteroid';
import * as Star from './star';

import { randomFloat, randomInt } from './utils';

export function create({ stars = 512, asteroids = 56 }) {
  const props = {
    stars,
    asteroids,
    start: null,
  };

  props.start = function () {
    for (let i = 0; i < props.stars; i++) {
      Star.create({
        index: randomInt(0, 4),
        x: randomInt(MIN_X, MAX_X),
        y: randomInt(-32, app.view.height),
        speed: {
          x: 0,
          y: randomFloat(0.1, 0.45),
        }
      });
    }

    for (let i = 0; i < props.asteroids; i++) {
      Asteroids.create({
        x: randomInt(MIN_X, MAX_X),
        y: randomInt(-32, app.view.height),
        z: -1,
        speed: {
          x: 0,
          y: randomFloat(0.1, 0.45),
        }
      });
    }
  }

  props.start();

  return props;
}
