import { AnimatedSprite, Spritesheet, Texture, BaseTexture, Assets } from 'pixi.js';

export function create() {
  const props = {
    animations: {},
    add: null,
    get: null,
    play: null,
    stop: null,
  };

  props.add = function (name, data, opts = { autoUpdate: true }) {
    const sprite = new AnimatedSprite(data.map((img) => Texture.from(img)), opts.autoUpdate);
    props.animations[name] = sprite;
    return sprite;
  }

  props.get = function(name) {
    return props.animations[name] || null;
  }

  props.play = function(name, opts = { loop: true }) {
    const animation = props.get(name);
    if (animation) {
      animation.loop = opts.loop;
      animation.gotoAndPlay(0);
      return animation;
    }
    return null;
  }

  props.stop = function(name) {
    const animation = props.get(name);
    if (animation) {
      animation.gotoAndStop(0);
      return animation;
    }
    return null;
  }

  return props;
}
