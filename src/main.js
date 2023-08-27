import app from './app';

import * as Player from './player';
import * as Stars from './bg';

Stars.create({ amount: 512 });
Player.create({ x: 0, y: app.view.height });
