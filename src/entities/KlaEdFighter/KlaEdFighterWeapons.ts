import { GameObject, Timer } from "core";
import { Projectile, Weapon } from "core/typings";
import { AnimatedSprite, Assets } from "pixi.js";

export default class KlaedFighterWeapons implements Weapon {
  public ready: boolean = true;
  private _countdown: number = 1000;
  private shootingSprite: AnimatedSprite;
  private bullet: Projectile;
  private timer: Timer;
  private scene: GameObject;

  constructor(scene: GameObject, bullet: Projectile) {
    this.scene = scene;
    this.bullet = bullet.clone();
    this.timer = new Timer();
  }

  set countdown(ms: number) {
    this._countdown = ms;
    this.startCountdown();
  }

  private startCountdown(): void {
    this.timer.timeout(() => {
      this.ready = true;
    }, this._countdown);
  }

  private addShootingSprite(): void {
    const spritesheet = Assets.get("klaed_fighter_weapons");
    this.shootingSprite = new AnimatedSprite(spritesheet.animations["fire"]);
    this.shootingSprite.animationSpeed = this.scene.speedAnimation;
    this.shootingSprite.name = "klaed_fighter_weapons";
    this.shootingSprite.anchor.set(this.scene.anchor);
    this.shootingSprite.loop = false;
    this.shootingSprite.onComplete = () => {
      this.shootingSprite.gotoAndStop(0);
      this.startCountdown();
    };
    this.shootingSprite.onFrameChange = (currentFrame: number) => {
      if (currentFrame === 1) this.fireLeftWeapon();
      if (currentFrame === 2) this.fireRightWeapon();
    };
    this.shootingSprite.setParent(this.scene);
  }

  private fireLeftWeapon(): void {
    const clone = this.bullet.clone();
    clone.x = this.shootingSprite.parent.position.x - 8;
    clone.y = this.shootingSprite.parent.position.y + 12;
    clone.shoot();
  }

  private fireRightWeapon(): void {
    const clone = this.bullet.clone();
    clone.x = this.shootingSprite.parent.position.x + 8;
    clone.y = this.shootingSprite.parent.position.y + 12;
    clone.shoot();
  }

  public equip(): void {
    this.addShootingSprite();
    this.startCountdown();
  }

  public fire(): boolean {
    if (!this.shootingSprite.playing && this.ready) {
      this.ready = false;
      this.shootingSprite.play();
      return true;
    }
    return false;
  }

  public unequip(): void {
    this.ready = false;
    this.shootingSprite.visible = false;
  }
}
