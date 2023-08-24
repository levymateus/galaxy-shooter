import app from './app';

import * as Bullet from './bullet';
import * as Rocket from './rocket';

export function create({ x, y, label, count, type, cd }) {
  const props = {
    x, y,
    label,
    loaded: false,
    countdown: cd,
    ammo: {
      count: count,
      type: type,
    },
    start: null,
    update: null,
    destroy: null,
    shoot: null,
  };

  props.start = function() {

  }

  props.update = function(delta) {
    if (props.countdown - delta > 0) {
      props.countdown -= delta;
      props.loaded = false;
    } else {
      props.countdown = 0;
      props.loaded = true;
    }
  }

  props.destroy = function() {

  }

  props.shoot = function() {
    if (!props.loaded) {
      return false
    }

    if (props.ammo.count >= 1) {
      props.ammo.count -= 1;
      props.loaded = false;
    } else {
      return false;
    }

    switch (props.ammo.type) {
      case 'bullet':
        Bullet.create({ x: props.x, y: props.y });
        props.countdown = cd;
        break;
      case 'rocket':
        Rocket.create({ x: props.x, y: props.y });
        props.countdown = cd;
      default:
        return false;
    }

    return true
  }

  props.start();
  app.ticker.add(props.update);

  return props;
}
