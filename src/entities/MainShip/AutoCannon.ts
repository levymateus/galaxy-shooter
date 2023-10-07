import { Timer, GameObject } from "core";
import { Projectile, Weapon } from "core/typings";
import { AnimatedSprite, Assets } from "pixi.js";

export default class AutoCannon implements Weapon {
  public ready: boolean = true;
  private timer: Timer;
  private bullet: Projectile;
  private scene: GameObject;
  private _countdown: number = 2000;
  private shootingSprite: AnimatedSprite;

  constructor(parent: GameObject, bullet: Projectile) {
    this.scene = parent;
    this.bullet = bullet.clone();
    this.timer = new Timer();
  }

  set countdown(ms: number) {
    this._countdown = ms;
    this.startCoutdown();
  }

  private startCoutdown(): void {
    this.timer.timeout(() => {
      this.ready = true;
    }, this._countdown);
  }

  private addShootingSprite(): void {
    const shootingSheet = Assets.get('mainship_weapons_auto_cannon');
    this.shootingSprite = new AnimatedSprite(shootingSheet.animations['fire']);
    this.shootingSprite.anchor.set(this.scene.anchor);
    this.shootingSprite.animationSpeed = this.scene.speedAnimation;
    this.shootingSprite.loop = false;
    this.shootingSprite.onFrameChange = (currentFrame: number) => {
      if (currentFrame === 2) return this.fireLeftWeapon();
      if (currentFrame === 3) return this.fireRightWeapon();
    }
    this.shootingSprite.onComplete = () => {
      this.shootingSprite.gotoAndStop(0);
      this.startCoutdown();
    }
    this.shootingSprite.setParent(this.scene);
  }

  private fireLeftWeapon(): void {
    const clone = this.bullet.clone();
    clone.x = this.shootingSprite.parent.position.x - 8;
    clone.y = this.shootingSprite.parent.position.y - 12;
    clone.shoot();
  }

  private fireRightWeapon(): void {
    const clone = this.bullet.clone();
    clone.x = this.shootingSprite.parent.position.x + 8;
    clone.y = this.shootingSprite.parent.position.y - 12;
    clone.shoot();
  }

  public equip(): void {
    this.addShootingSprite();
    this.startCoutdown();
  }

  public unequip(): void {
    this.ready = false;
    this.shootingSprite.visible = false;
  }

  public fire(): boolean {
    if (!this.shootingSprite.playing && this.ready) {
      this.ready = false;
      this.shootingSprite.play();
      return true;
    }
    return false;
  }
}
