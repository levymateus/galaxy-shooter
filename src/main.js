import app, { MAX_X, MIN_X } from './app';

import * as Asteroid from './asteroid';
import * as Stars from './bg';
import * as Player from './player';

import { randIntBet } from './utils';

Stars.create({ stars: 512, asteroids: 56 });
Player.create({ x: 0, y: app.view.height });

for (let i = 0; i <= randIntBet(24, 32); i++) {
  Asteroid.create({
    x: randIntBet(MIN_X, MAX_X),
    y: randIntBet(-32, app.view.height),
  });
}
