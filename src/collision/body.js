import uuid from '../uuid';

import * as CollisionServer from './collision-server';

export function create(ref, shape){

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
  };

  props.remove = function() {
    CollisionServer.get().remove(ref);
  }

  ref.body = props;
  CollisionServer.create().register(ref);

  return props;

}
