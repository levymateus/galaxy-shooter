import app from '../app';
import uuid from '../uuid';
import config from '../config';

import * as CollisionServer from './collision-server';

import { Graphics } from 'pixi.js';

export function create(ref, shape, opts = { debug: config.debug }){

  const props = {
    id: uuid(),
    gr: new Graphics(),
    shape: {
      type: 'Circle',
      width: 1,
      height: 1,
      radius: 16,
      ...shape,
    },
    update: null,
    remove: null,
  };

  props.update = function() {
    if (opts.debug) {
      props.gr.clear();
      props.gr.beginFill('#d90fbe', 0.6);
      if (props.shape.type === 'Circle') {
        props.gr.drawCircle(0, 0, props.shape.radius);
      }
      props.gr.endFill();
    }
  }

  props.remove = function() {
    app.ticker.remove(props.update);
    CollisionServer.get().remove(ref);
  }

  ref.body = props;
  CollisionServer.create().register(ref);
  ref.container.addChild(props.gr);
  ref.container.swapChildren(props.gr, ref.container.getChildAt(0));
  app.ticker.add(props.update);

  return props;

}
