import uuid from '../uuid';
import * as Elements from './elements';

import { Container, Text, TextStyle } from 'pixi.js';

export function create(text, { x = 0, y = 0, anchor = 0.5, style }) {
  const props = {
    id: uuid(), 
    x, y,
    type: 'text',
    container: new Container(),
    text: new Text(text, new TextStyle({
      fontSize: 48,
      fill: 0xff1010,
      trim: true,
      ...style,
    })),
    remove: null,
    update: null,
  };

  props.remove = function() {
    props.container.destroy();
    Elements.remove(props);
  }

  Elements.add(props);

  props.text.x = x;
  props.text.y = y;
  props.text.anchor.set(anchor);

  return props;

}
