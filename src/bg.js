import app, { MAX_X, MIN_X } from './app';

import * as Star from './star';
import * as Asteroids from './asteroid';

import { randomFloat, rng } from './utils';

export function create({ amount = 512, asteroids = 56 }) {
  const props = {
    amount,
    asteroids,
    start: null,
  };

  props.start = function() {
    for (let i = 0; i < props.amount; i++) {
      Star.create({
        index: rng(0, 4),
        x: rng(MIN_X, MAX_X),
        y: rng(-32, app.view.height),
        speed: {
          x: 0,
          y: randomFloat(0.1, 0.45),
        }
      });
    }

    for (let i = 0; i < props.asteroids; i++) {
      Asteroids.create({
        x: rng(MIN_X, MAX_X),
        y: rng(-32, app.view.height),
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
