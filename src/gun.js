import app from './app';

import * as Bullet from './bullet';
import * as Rocket from './rocket';
import * as Timer from './timer';

export function create({ x, y, label, count, type, cd = 1000 }) {
  const props = {
    x, y,
    label,
    loaded: true,
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
    props.countdown = Timer.countdown(cd, () => {
      props.loaded = true;
    });
  }

  props.update = function(delta) {
    // if (props.countdown - delta > 0) {
    //   props.countdown -= delta;
    //   props.loaded = false;
    // } else {
    //   props.countdown = 0;
    //   props.loaded = true;
    // }
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
        props.loaded = false;
        props.countdown.start();
        break;
      case 'rocket':
        Rocket.create({ x: props.x, y: props.y });
        props.loaded = false;
        props.countdown .start();
      default:
        return false;
    }

    return true
  }

  props.start();
  app.ticker.add(props.update);

  return props;
}
