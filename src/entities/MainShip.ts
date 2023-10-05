import { Actions, AxisAlignedBounds, Input, Projectile, Weapon, Wrapper } from "core";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { AnimatedSprite, Assets, Container, Point, Sprite } from "pixi.js";
import Entities from "./Entities";
import { isValidCollisor } from "utils/utils";

class SpaceshipEngine {

  private wrapper: GameObject;
  private engineSprite: Sprite;
  private idleEngineSprite: AnimatedSprite;
  private enginePowerSprite: AnimatedSprite;

  constructor(wrapper: GameObject) {
    this.wrapper = wrapper;
    this.addBaseEngineSprite();
    this.addIdleEngineSprite();
    this.addEnginePowerSprite();
  }

  private addBaseEngineSprite(): void {
    this.engineSprite = Sprite.from(Assets.get('mainship_base_engine'));
    this.engineSprite.anchor.set(this.wrapper.anchor);
    this.engineSprite.zIndex = -1;
    this.wrapper.addChild(this.engineSprite);
  }

  private addIdleEngineSprite(): void {
    const spritesheet = Assets.get('mainship_base_engine_idle');
    this.idleEngineSprite = new AnimatedSprite(spritesheet.animations['idle']);
    this.idleEngineSprite.animationSpeed = this.wrapper.speedAnimation;
    this.idleEngineSprite.anchor.set(this.wrapper.anchor);
    this.idleEngineSprite.zIndex = -2;
    this.idleEngineSprite.play();
    this.wrapper.addChild(this.idleEngineSprite);
  }

  private addEnginePowerSprite(): void {
    const poweringSheet = Assets.get('mainship_base_engine_powering');
    this.enginePowerSprite = new AnimatedSprite(poweringSheet.animations['powering']);
    this.enginePowerSprite.animationSpeed = this.wrapper.speedAnimation;
    this.enginePowerSprite.anchor.set(this.wrapper.anchor);
    this.enginePowerSprite.zIndex = -2;
    this.wrapper.addChild(this.enginePowerSprite);
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

class AutoCannonBullet
  extends GameObject
  implements Projectile {

  public direction: Point;

  private wrapper: Container;
  private bulletSprite: AnimatedSprite;

  constructor(wrapper: Container) {
    super(Entities.CANNON_BULLET);
    this.speed.set(0, 10);
    this.wrapper = wrapper;
    this.direction = new Point(0, -1);
    this.collisionShape.radius = 8;
  }

  private addBulletSprite(): void {
    const bulletSheet = Assets.get('mainship_weapons_projectile_auto_cannon_bullet');
    this.bulletSprite = new AnimatedSprite(bulletSheet.animations['shoot']);
    this.bulletSprite.animationSpeed = this.speedAnimation;
    this.bulletSprite.name = this.name;
    this.bulletSprite.anchor.set(this.anchor);
    this.bulletSprite.loop = true;
    this.bulletSprite.scale.set(this.bulletSprite.scale.x - 0.3);
    this.bulletSprite.play();
    this.setParent(this.wrapper);
    this.addChild(this.bulletSprite);
  }

  private addListeners(): void {
    this.update = this.onUpdate;
    this.collide = this.onCollides;
    this.outofbounds = this.onOutOfBounds;
  }

  private onOutOfBounds(): void {
    this.collisionTest = false;
    this.destroy({ children: true });
  }

  private onUpdate(dt: number): void {
    this.position.y += this.direction.y * this.speed.y * dt;
  }

  private onCollides(collisor: GameObject): void {
    if (isValidCollisor([Entities.ASTEROID, Entities.KLA_ED_FIGHTER], collisor))
      return this.destroy({ children: true });
  }

  public shoot(): void {
    this.addBulletSprite();
    this.addListeners();
  }

  public clone() {
    return new AutoCannonBullet(this.wrapper);
  }
}

class AutoCannon implements Weapon {

  public ready: boolean = true;

  private timer: Timer;
  private bullet: Projectile;
  private wrapper: GameObject;
  private _countdown: number = 100;
  private shootingSprite: AnimatedSprite;

  constructor(parent: GameObject, bullet: Projectile) {
    this.wrapper = parent;
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
    this.shootingSprite.anchor.set(this.wrapper.anchor);
    this.shootingSprite.animationSpeed = this.wrapper.speedAnimation;
    this.shootingSprite.loop = false;
    this.shootingSprite.onFrameChange = (currentFrame: number) => {
      if (currentFrame === 2) return this.fireLeftWeapon();
      if (currentFrame === 3) return this.fireRightWeapon();
    }
    this.shootingSprite.onComplete = () => {
      this.shootingSprite.gotoAndStop(0);
      this.startCoutdown();
    }
    this.shootingSprite.setParent(this.wrapper);
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

export default class MainShip extends GameObject {

  private wrapper: Container;
  private baseSprite: Sprite;
  private engine: SpaceshipEngine;
  private autoCannon: AutoCannon;
  private weapon: Weapon;
  private maxY: number = 640;

  constructor(wrapper: Container) {
    super(Entities.MAIN_SHIP);
    this.wrapper = wrapper;
    this.collisionShape.radius = 20;
    this.addEngine();
    this.addAutoCannon();
    this.addBaseSprite();
    this.addListeners();
    this.sortChildren();
  }

  private addBaseSprite(): void {
    this.baseSprite = Sprite.from(Assets.get('mainship_base_full_health'));
    this.baseSprite.anchor.set(this.anchor);
    this.baseSprite.zIndex = 0;
    this.addChild(this.baseSprite);
  }

  private addAutoCannon(): void {
    this.autoCannon = new AutoCannon(this, new AutoCannonBullet(this.wrapper));
    this.equipWeapon(this.autoCannon);
  }

  private equipWeapon(weapon: Weapon): void {
    this.weapon = weapon;
    this.weapon.equip();
  }

  private addEngine(): void {
    this.engine = new SpaceshipEngine(this);
    this.engine.idle();
  }

  private addListeners(): void {
    this.update = this.onUpdate;
    this.collide = this.onCollide;
    this.outofbounds = this.onOutOfBounds;
    this.on('added', this.onEnterScene, this);
    Input.on('onActionPressed', this.onActionPressed, this);
    Input.on('onActionReleased', this.onActionReleased, this);
  }

  private onEnterScene(wrapper: Wrapper): void {
    this.maxY = wrapper.bounds.bottom;
    this.position.y = this.maxY - 64;
  }

  private onActionPressed(action: Actions): void {
    if (action === Actions.MOVE_UP) this.speed.y = -1;
    if (action === Actions.MOVE_LEFT) this.speed.x = 1;
    if (action === Actions.MOVE_RIGHT) this.speed.x = -1;
    if (action === Actions.MOVE_DOWN) this.speed.y = 1;
    if (action === Actions.WEAPON_FIRE) this.weapon.fire();
  }

  private onActionReleased(action: Actions): void {
    if (action === Actions.MOVE_UP) this.engine.idle();
  }

  private onUpdate(): void {
    if (Math.abs(this.speed.y) >= 1) this.engine.power();
    this.move(this.speed);
    this.speed.set(0, 0);
  }

  private onCollide(collisor: GameObject): void {
    if (isValidCollisor([], collisor)) return this.destroy({ children: true });
  }

  private onOutOfBounds(bounds: AxisAlignedBounds): void {
    if (this.y < bounds.top) this.y = bounds.top;
    if (this.x > bounds.right) this.x = bounds.right;
    if (this.y > bounds.bottom) this.y = bounds.bottom;
    if (this.x < bounds.left) this.x = bounds.left;
  }

  private move(offset: Point) {
    this.speed.x += offset.x;
    this.speed.y += offset.y;
    this.position.set(
      this.position.x + offset.x,
      this.position.y + offset.y,
    );
    if (this.position.y >= this.maxY - 64) {
      this.position.set(this.position.x, this.maxY - 64);
    }
  }

}
