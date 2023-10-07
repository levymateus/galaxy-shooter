import { GameObject } from "core";
import { AnimatedSprite, Assets, Sprite } from "pixi.js";

export default class SpaceshipEngine {
  private scene: GameObject;
  private engineSprite: Sprite;
  private idleEngineSprite: AnimatedSprite;
  private enginePowerSprite: AnimatedSprite;

  constructor(scene: GameObject) {
    this.scene = scene;
    this.addBaseEngineSprite();
    this.addIdleEngineSprite();
    this.addEnginePowerSprite();
  }

  private addBaseEngineSprite(): void {
    this.engineSprite = Sprite.from(Assets.get('mainship_base_engine'));
    this.engineSprite.anchor.set(this.scene.anchor);
    this.engineSprite.zIndex = -1;
    this.scene.addChild(this.engineSprite);
  }

  private addIdleEngineSprite(): void {
    const spritesheet = Assets.get('mainship_base_engine_idle');
    this.idleEngineSprite = new AnimatedSprite(spritesheet.animations['idle']);
    this.idleEngineSprite.animationSpeed = this.scene.speedAnimation;
    this.idleEngineSprite.anchor.set(this.scene.anchor);
    this.idleEngineSprite.zIndex = -2;
    this.idleEngineSprite.play();
    this.scene.addChild(this.idleEngineSprite);
  }

  private addEnginePowerSprite(): void {
    const poweringSheet = Assets.get('mainship_base_engine_powering');
    this.enginePowerSprite = new AnimatedSprite(poweringSheet.animations['powering']);
    this.enginePowerSprite.animationSpeed = this.scene.speedAnimation;
    this.enginePowerSprite.anchor.set(this.scene.anchor);
    this.enginePowerSprite.zIndex = -2;
    this.scene.addChild(this.enginePowerSprite);
  }

  public power(): void {
    this.idleEngineSprite.visible = false;
    this.enginePowerSprite.visible = true;
    this.idleEngineSprite.stop();
    if (!this.enginePowerSprite.playing) {
      this.enginePowerSprite.play();
    }
  }

  public idle(): void {
    this.idleEngineSprite.visible = true;
    this.enginePowerSprite.visible = false;
    this.enginePowerSprite.stop();
    if (!this.idleEngineSprite.playing) {
      this.idleEngineSprite.play();
    }
  }
}
