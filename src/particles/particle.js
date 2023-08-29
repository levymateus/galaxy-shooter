import { Sprite, Texture } from "pixi.js";

export function create({
  container,
  x = 0, y = 0,
  speed =  { x: 1, y: 1 },
  dir = { x: 1, y: 1 },
  scale = 1,
  alpha = 1,
  angle = 0,
  assetPath,
}){

  const props = {
    x, y,
    dir,
    speed,
    scale,
    angle,
    container,
    alpha,
    move: null,
    start: null,
    sprite: null,
  };

  props.start = function() {
    props.sprite = new Sprite(Texture.from(assetPath));
    props.sprite.x = x;
    props.sprite.y = y;
    props.sprite.angle = angle;
    props.sprite.scale.set(scale, scale);
    props.sprite.anchor.set(0.5);
    props.sprite.alpha = props.alpha;
    props.container.addChild(props.sprite);
  }

  props.start();

  return props;
}
