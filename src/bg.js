import app, { MAX_X, MIN_X } from './app';

import * as Star from './star';

import { randomFloat, rng } from './utils';

export function create({ amount = 512 }) {
  const props = {
    amount,
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
  }

  props.start();

  return props;
}
