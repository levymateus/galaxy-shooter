import { GameObject } from "core";
import { Assets, Sprite } from "pixi.js";

type MainshipBaseSpriteKeys = 'mainship_base_full_health'
  | 'mainship_base_damaged'
  | 'mainship_base_slight_damaged'
  | 'mainship_base_very_damaged';
type MainShipBaseState = MainshipBaseSpriteKeys;

export default class MainShipBase {
  public state: MainShipBaseState;
  private parent: GameObject;

  constructor(parent: GameObject) {
    this.parent = parent;
  }

  private addSprite(key: MainshipBaseSpriteKeys) {
    const sprite = Sprite.from(Assets.get(key));
    sprite.name = key;
    sprite.visible = true;
    sprite.anchor.set(this.parent.anchor);
    this.parent.addChild(sprite);
  }

  public changeState(state: MainShipBaseState) {
    let sprite = this.parent.getChildByName(this.state);
    if (sprite) sprite.visible = false;

    this.state = state;
    sprite = this.parent.getChildByName(this.state);
    if (sprite) {
      sprite.visible = true; return;
    }
    
    return this.addSprite(state);
  }
}
