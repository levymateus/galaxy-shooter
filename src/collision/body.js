import app from '../app';
import uuid from '../uuid';

import * as CollisionServer from './collision-server';

import { Graphics } from 'pixi.js';

export function create(ref, shape){

  const gr = new Graphics();

  const props = {
    id: uuid(),
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
    gr.clear();
    gr.beginFill('#d90fbe');
    if (props.shape.type === 'Circle') {
      gr.drawCircle(ref.x, ref.y, props.shape.radius);
    }
    gr.endFill();
  }

  props.remove = function() {
    gr.clear();
    CollisionServer.get().remove(ref);
    app.ticker.remove(props.update);
  }

  ref.body = props;
  CollisionServer.create().register(ref);
  app.stage.addChild(gr);
  app.ticker.add(props.update);

  return props;

}
