import app from '../app';
import uuid from '../uuid';
import config from '../config';

import * as CollisionServer from './collision-server';

import { Graphics } from 'pixi.js';

export function create(ref, shape, opts = { debug: config.debug }){

  const props = {
    id: uuid(),

    shape: {
      type: 'Circle',
      width: 1,
      height: 1,
      radius: 16,
      ...shape,
    },

    remove: null,

    gr: opts.debug ? new Graphics() : undefined,
    start: null,
    update: opts.debug ? null : undefined,
  };

  props.start = function() {
    CollisionServer.create().register(ref);
    if (opts.debug) {
      ref.container.addChild(props.gr);
      ref.container.swapChildren(props.gr, ref.container.getChildAt(0));
    }
  }

  props.update = opts.debug && function() {
    props.gr.clear();
    props.gr.beginFill('#d90fbe', 0.6);
    if (props.shape.type === 'Circle') {
      props.gr.drawCircle(0, 0, props.shape.radius);
    }
    props.gr.endFill();
  }

  props.remove = function() {
    app.ticker.remove(props.update);
    CollisionServer.get().remove(ref);
  }

  ref.body = props;

  props.start();
  app.ticker.add(props.update);

  return props;

}
