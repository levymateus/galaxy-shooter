import { Point } from "@pixi/math";
import { AxisAlignedBounds, Projectile, Weapon } from "core";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { AnimatedSprite, Assets, Container, Sprite } from "pixi.js";
import { DOWN, angleBetween, dice, isValidCollisor, randf } from "utils/utils";
import Entities from "./Entities";

class KlaedBullet
  extends GameObject
  implements Projectile {

  public direction: Point;

  private wrapper: Container;
  private baseSprite: AnimatedSprite;
  private bounds: AxisAlignedBounds;

  constructor(wrapper: Container, bounds: AxisAlignedBounds) {
    super(Entities.KLA_ED_BULLET);
    this.wrapper = wrapper;
    this.bounds = bounds;
    this.speed.y = 5;
    this.direction = new Point(0, 1);
    this.collisionShape.radius = 2;
    this.angle = this.direction.y * 180;
  }

  private addBaseSprite(): void {
    const spritesheet = Assets.get("klaed_bullet");
    this.baseSprite = new AnimatedSprite(spritesheet.animations["shoot"]);
    this.baseSprite.animationSpeed = this.speedAnimation;
    this.baseSprite.anchor.set(this.anchor);
    this.baseSprite.visible = true;
    this.baseSprite.play();
    this.setParent(this.wrapper);
    this.addChild(this.baseSprite);
  }

  private onCollides(collisor: GameObject): void {
    if (isValidCollisor([Entities.MAIN_SHIP], collisor)) return this.destroy({ children: true });
  }

  private onOutOfBounds(): void {
    return this.destroy({ children: true });
  }

  protected onUpdate(dt: number): void {
    this.position.y += this.speed.y * this.direction.y * dt;
  }

  public shoot(): void {
    this.addBaseSprite();
    this.update = this.onUpdate;
    this.collide = this.onCollides;
    this.outofbounds = this.onOutOfBounds;
  }

  public clone() {
    return new KlaedBullet(this.wrapper, this.bounds);
  }
}

class KlaedFighterWeapons implements Weapon {

  public ready: boolean = true;

  private _countdown: number = 1000;
  private shootingSprite: AnimatedSprite;
  private bullet: Projectile;
  private timer: Timer;
  private wrapper: GameObject;

  constructor(wrapper: GameObject, bullet: Projectile) {
    this.wrapper = wrapper;
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
    this.shootingSprite.animationSpeed = this.wrapper.speedAnimation;
    this.shootingSprite.name = "klaed_fighter_weapons";
    this.shootingSprite.anchor.set(this.wrapper.anchor);
    this.shootingSprite.loop = false;
    this.shootingSprite.onComplete = () => {
      this.shootingSprite.gotoAndStop(0);
      this.startCountdown();
    };
    this.shootingSprite.onFrameChange = (currentFrame: number) => {
      if (currentFrame === 1) this.fireLeftWeapon();
      if (currentFrame === 2) this.fireRightWeapon();
    };
    this.shootingSprite.setParent(this.wrapper);
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

export default class KlaedFighter extends GameObject {

  public bounds: AxisAlignedBounds;

  private static TARGET_MIN_DISTANCE: number = 256;
  private direction: Point;
  private baseSprite: Sprite;
  private engineSprite: AnimatedSprite;
  private destructionSprite: AnimatedSprite;
  private target: GameObject | null = null;
  private weapons: KlaedFighterWeapons | null = null;
  private wrapper: Container;
  private isKamikaze: boolean = false;

  constructor(wrapper: Container, x?: number, y?: number) {
    super(Entities.KLA_ED_FIGHTER);
    this.wrapper = wrapper;
    this.position.set(x, y);
    this.speed.set(2, 2);
    this.collisionShape.radius = 14;
    this.direction = DOWN;
    this.angle = this.direction.y * 180;
    this.addBaseSprite();
    this.addEngineSprite();
    this.addDestructionSprite();
    this.addWeapons();
    this.addListeners();
  }

  private addBaseSprite(): void {
    this.baseSprite = Sprite.from(Assets.get("klaed_fighter_base"));
    this.baseSprite.anchor.set(this.anchor);
    this.addChild(this.baseSprite);
  }

  private addEngineSprite(): void {
    const spritesheet = Assets.get("klaed_fighter_engine");
    this.engineSprite = new AnimatedSprite(spritesheet.animations["engine"]);
    this.engineSprite.animationSpeed = this.speedAnimation;
    this.engineSprite.anchor.set(this.anchor);
    this.engineSprite.play();
    this.addChild(this.engineSprite);
  }

  private addDestructionSprite(): void {
    const spritesheet = Assets.get("klaed_fighter_destruction");
    this.destructionSprite = new AnimatedSprite(spritesheet.animations["destruction"]);
    this.destructionSprite.animationSpeed = this.speedAnimation;
    this.destructionSprite.anchor.set(this.anchor);
    this.destructionSprite.loop = false;
    this.destructionSprite.visible = false;
    this.addChild(this.destructionSprite);
  }

  private addWeapons(): void {
    const shouldEquipWeapons = dice(2).roll() >= 2;
    if (shouldEquipWeapons) {
      this.weapons = new KlaedFighterWeapons(this, new KlaedBullet(this.wrapper, this.bounds))
      this.weapons.countdown = randf(300, 1000);
      return this.weapons.equip();
    }
    return;
  }

  private addListeners(): void {
    this.isKamikaze = dice(2).roll() >= 2;
    this.update = this.isKamikaze ? this.kamikaze : this.sinMoving;
    this.collide = this.onCollide;
    this.outofbounds = this.onOutOfBounds;
  }

  private onOutOfBounds(bounds: AxisAlignedBounds): void {
    if (this.isKamikaze) return this.destroy({ children: true });
    if (this.y > bounds.bottom) return this.destroy({ children: true });
  }

  private kamikaze(dt: number): void {
    if (this.target) this.target = this.attack(this.target);
    this.position.y -= this.direction.y * this.speed.y * dt;
    this.position.x -= this.direction.x * this.speed.x * dt;
  }

  private attack(target: GameObject): GameObject | null {
    const dist = new Point(this.x, this.y).subtract(target.position);
    this.direction = dist.normalize();
    if (dist.magnitude() <= KlaedFighter.TARGET_MIN_DISTANCE) {
      this.engineSprite.animationSpeed += 0.3;
      this.speed = this.speed.add(new Point(3, 3));
      return null;
    }
    this.angle = angleBetween(this.getGlobalPosition(), target.getGlobalPosition()) - 270;
    return target;
  }

  private sinMoving(dt: number): void {
    this.weapons?.fire();
    this.position.y += this.direction.y * this.speed.y * dt;
    this.position.x += Math.sin(this.position.y * 0.01);
  }

  protected onCollide(collisor: GameObject): void {
    if (isValidCollisor([Entities.MAIN_SHIP, Entities.CANNON_BULLET], collisor))
      return this.explodeAndDestroy();
  }

  public setTarget(target: GameObject): void {
    this.target = target;
  }

  public explodeAndDestroy(): void {
    this.ticker.stop();
    this.weapons?.unequip();
    this.collisionTest = false;
    this.baseSprite.visible = false;
    this.engineSprite.visible = false;
    this.destructionSprite.visible = true;
    this.destructionSprite.onComplete = () => {
      super.destroy({ children: true });
    }
    this.destructionSprite.play();
  }
}
