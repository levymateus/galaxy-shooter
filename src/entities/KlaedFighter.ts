import * as M from "@pixi/math";
import { AxisAlignedBounds, Projectile, Weapon } from "core";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { AnimatedSprite, Assets, Container, Point, RAD_TO_DEG, Sprite } from "pixi.js";

class KlaedBullet
  extends GameObject
  implements Projectile {

  public direction: Point;
  private sprite: AnimatedSprite;
  private axis: AxisAlignedBounds;

  constructor(parent: Container, axis: AxisAlignedBounds) {
    super("klaed_bullet");

    this.angle = 180;
    this.axis = axis;
    this.speed.y = 5;
    this.direction = new Point(0, 1);
    this.collisionShape.radius = 2;

    const bulletSheet = Assets.get("klaed_bullet");
    this.sprite = new AnimatedSprite(bulletSheet.animations["shoot"]);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.4;
    this.sprite.visible = false;

    this.addChild(this.sprite);
    this.setParent(parent);
  }

  protected onUpdate(dt: number): void {
    const isOutOfBounds = this.y >= this.axis.bottom;
    if (isOutOfBounds) this.destroy();
    else this.position.y += this.speed.y * this.direction.y * dt;
  }

  private onCollides(collisor: GameObject): void {
    if (["mainship"].some(name => collisor.name.includes(name))) {
      this.tiker.stop();
      this.destroy();
    }
  }

  public shoot(): void {
    this.sprite.visible = true;
    this.update = this.onUpdate;
    this.collide = this.onCollides;
    this.sprite.play();
  }

  public clone(): Projectile {
    return new KlaedBullet(this.parent, this.axis);
  }
}

class KlaedFighterWeapons implements Weapon {

  public ready: boolean = true;
  private spriteShooting: AnimatedSprite;
  private bullet: Projectile;
  private timer: Timer;

  constructor(parent: Container, bullet: Projectile) {
    this.bullet = bullet.clone();
    this.timer = new Timer();

    const weaponsSheet = Assets.get("klaed_fighter_weapons");
    this.spriteShooting = new AnimatedSprite(weaponsSheet.animations["fire"]);
    this.spriteShooting.name = "klaed_fighter_weapons"
    this.spriteShooting.anchor.set(0.5);
    this.spriteShooting.loop = false;
    this.spriteShooting.animationSpeed = 0.4;

    this.spriteShooting.onComplete = () => {
      this.spriteShooting.gotoAndStop(0);
      this.timer.timeout(() => {
        this.ready = true;
      }, 1000);
    };

    this.spriteShooting.onFrameChange = (currentFrame: number) => {
      if (currentFrame === 1) {
        const clone = this.bullet.clone();
        clone.x = this.spriteShooting.parent.position.x - 8;
        clone.y = this.spriteShooting.parent.position.y + 12;
        clone.shoot();
      }
      if (currentFrame === 2) {
        const clone = this.bullet.clone();
        clone.x = this.spriteShooting.parent.position.x + 8;
        clone.y = this.spriteShooting.parent.position.y + 12;
        clone.shoot();
      }
    };

    this.spriteShooting.setParent(parent);
  }

  public fire(): boolean {
    if (!this.spriteShooting.playing && this.ready) {
      this.ready = false;
      this.spriteShooting.play();
      return true;
    }
    return false;
  }

  public destroy(): void {
    this.spriteShooting.removeFromParent();
    this.spriteShooting.destroy({ children: true }); // da problema!!!!
  }
}

/**
 * Fighter é um camicase que tenta se explodir no jogador para causar dano.
 */
export default class KlaedFighter extends GameObject {

  private direction: Point;
  private spriteBase: Sprite;
  private spriteEngine: AnimatedSprite;
  private spriteDestruction: AnimatedSprite;
  private target: GameObject | null = null;
  private weapons: KlaedFighterWeapons | null = null;

  public targetMinDistance: number = 256;
  public axis: AxisAlignedBounds;

  constructor(parent: Container, axis: AxisAlignedBounds, x: number, y: number) {
    super("klaed_fighter");

    this.angle = 180;
    this.position.set(x, y);
    this.speed.set(2, 2);
    this.collisionShape.radius = 16;
    this.direction = new Point(0, 1);
    this.axis = axis;
    this.spriteBase = Sprite.from(Assets.get("klaed_fighter_base"));
    this.spriteBase.anchor.set(0.5);

    const engineSheet = Assets.get("klaed_fighter_engine");
    this.spriteEngine = new AnimatedSprite(engineSheet.animations["engine"]);
    this.spriteEngine.anchor.set(0.5);
    this.spriteEngine.animationSpeed = 0.4;

    const destructionSheet = Assets.get("klaed_fighter_destruction");
    this.spriteDestruction = new AnimatedSprite(destructionSheet.animations["destruction"]);
    this.spriteDestruction.anchor.set(0.5);
    this.spriteDestruction.animationSpeed = 0.4;
    this.spriteDestruction.loop = false;
    this.spriteDestruction.visible = false;

    this.addChild(this.spriteBase);
    this.addChild(this.spriteEngine);
    this.addChild(this.spriteDestruction);

    this.weapons = Math.random() ? new KlaedFighterWeapons(this, new KlaedBullet(parent, axis)) : null;
    this.update = Math.random() >= 0.5 ? this.sinMoving : this.kamikaze;
    this.collide = this.onCollide;

    this.power();
  }

  private kamikaze(dt: number): void {
    if (this.target) this.target = this.attack(this.target);
    this.position.y -= this.direction.y * this.speed.y * dt;
    this.position.x -= this.direction.x * this.speed.x * dt;
    this.isInArea();
  }

  private attack(target: GameObject): GameObject | null {
    const dist = new M.Point(this.x, this.y).subtract(target.position);
    this.direction = dist.normalize();
    if (dist.magnitude() <= this.targetMinDistance) {
      this.spriteEngine.animationSpeed += 0.3;
      this.speed = this.speed.add(new Point(3, 3));
      return null;
    } else {
      this.look(target.getGlobalPosition());
    }
    return target;
  }

  private fire(): void {
    this.weapons?.fire();
  }

  private sinMoving(dt: number): void {
    this.fire();
    this.position.y += this.direction.y * this.speed.y * dt;
    this.position.x += Math.sin(this.position.y * 0.01);
    this.isInArea();
  }

  private isInArea(): void {
    const isOut = this.y >= this.axis.bottom + 64
      || this.y <= this.axis.top - 64
      || this.x >= this.axis.right + 64
      || this.x <= this.axis.left - 64
    if (isOut) return this.destroy({ children: true });
  }

  private look(target: Point): void {
    const dist = new M.Point(target.x, target.y).subtract(this.getGlobalPosition());
    const angle = Math.atan2(dist.y, dist.x) * RAD_TO_DEG - 270;
    this.angle = angle;
  }

  protected onCollide(collisor: GameObject): void {
    if (["mainship", "cannon_bullet"].some(name => collisor.name.includes(name))) {
      return this.explodeAndDestroy();
    }
  }

  public setTarget(target: GameObject): void {
    this.target = target;
  }

  public power(): void {
    this.spriteEngine.play();
  }

  public explodeAndDestroy(): void {
    this.tiker.stop();
    this.weapons?.destroy();
    this.collisionTest = false;
    this.spriteBase.visible = false;
    this.spriteEngine.visible = false;
    this.spriteDestruction.visible = true;
    this.spriteDestruction.onComplete = () => {
      super.destroy({ children: true });
    }
    this.spriteDestruction.play();
  }
}
