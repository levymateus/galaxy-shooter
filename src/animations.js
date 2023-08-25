import { AnimatedSprite, Texture } from 'pixi.js';

export function create() {
  const props = {
    animations: [],
  };

  props.add = function(name, images, autoUpdate = true) {
    const sprite = new AnimatedSprite(images.map((img) => Texture.from(img)), autoUpdate);
    props.animations.push({ name, sprite });
    return sprite;
  }

  props.get = function(name) {
    return props.animations.find((animation) => animation.name === name);
  }

  props.play = function(name, opts = { loop: true }) {
    const animation = props.get(name);
    if (animation.sprite) {
      animation.sprite.loop = opts.loop;
      animation.sprite.gotoAndPlay(0);
      return animation.sprite;
    }
    return null;
  }

  props.stop = function(name) {
    const animation = props.get(name);
    if (animation) {
      animation.sprite.gotoAndStop(0);
      return animation.sprite;
    }
    return null;
  }

  return props;
}
