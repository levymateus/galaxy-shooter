import { AnimatedSprite, Spritesheet, Texture, BaseTexture, Assets } from 'pixi.js';

export function create() {
  const props = {
    animations: [],
    add: null,
    from: null,
    get: null,
    play: null,
    stop: null,
  };

  props.add = function (name, data, opts = { autoUpdate: true }) {
    const sprite = new AnimatedSprite(data.map((img) => Texture.from(img)), opts.autoUpdate);
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
