import app, { MIN_X, MAX_X } from './app';

import * as Player from './player';
import * as Stars from './bg';
import * as Asteroid from './asteroid';

import { rng, randomFloat } from './utils';

Stars.create({ amount: 512 });
Player.create({ x: 0, y: app.view.height });

for(let i = 0; i <= rng(10, 24); i++) {
  Asteroid.create({
    x: rng(MIN_X, MAX_X),
    y: rng(-32, app.view.height),
    name: 'Asteroid_outline_006',
  });
}
