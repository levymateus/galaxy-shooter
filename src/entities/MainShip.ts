import { Actions, AxisAlignedBounds, Input, Projectile, Weapon } from "core";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { AnimatedSprite, Assets, Circle, Container, Point, Sprite, Ticker } from "pixi.js";

class SpaceshipEngine {

  private parent: Container;
  private spriteEngine: Sprite;
  private spriteIdle: AnimatedSprite;
  private spritePower: AnimatedSprite;

  constructor(parent: Container) {
    this.parent = parent;
    this.spriteEngine = Sprite.from(Assets.get('mainship_base_engine'));

    const idleSheet = Assets.get('mainship_base_engine_idle');
    this.spriteIdle = new AnimatedSprite(idleSheet.animations['idle']);

    const poweringSheet = Assets.get('mainship_base_engine_powering');
    this.spritePower = new AnimatedSprite(poweringSheet.animations['powering']);

    this.spriteEngine.anchor.set(0.5);
    this.spriteIdle.anchor.set(0.5);
    this.spritePower.anchor.set(0.5);

    this.spriteEngine.zIndex = -1;
    this.spriteIdle.zIndex = -2;
    this.spritePower.zIndex = -2;

    this.spriteIdle.animationSpeed = 0.4;
    this.spritePower.animationSpeed = 0.4;

    this.parent.addChild(this.spriteEngine);
    this.parent.addChild(this.spriteIdle);
    this.parent.addChild(this.spritePower);

    this.spriteIdle.play();
  }

  public power(): void {
    this.spriteIdle.visible = false;
    this.spritePower.visible = true;
    this.spriteIdle.stop();

    if (!this.spritePower.playing) {
      this.spritePower.play();
    }
  }

  public idle(): void {
    this.spriteIdle.visible = true;
    this.spritePower.visible = false;
    this.spritePower.stop();

    if (!this.spriteIdle.playing) {
      this.spriteIdle.play();
    }
  }

}

class AutoCannonBullet
  extends GameObject
  implements Projectile {

  public direction: Point;

  private sprite: AnimatedSprite;
  private boundingRect: AxisAlignedBounds;

  constructor(parent: Container, axisAlignedBounds: AxisAlignedBounds) {
    super("auto_cannon_bullet");

    this.speed.set(0, 10);
    this.direction = new Point(0, -1);
    this.boundingRect = axisAlignedBounds;

    const bulletSheet = Assets.get('mainship_weapons_projectile_auto_cannon_bullet');
    this.sprite = new AnimatedSprite(bulletSheet.animations['shoot']);
    this.sprite.name = this.name;
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.4;
    this.sprite.loop = true;
    this.sprite.visible = false;
    this.sprite.scale.set(this.sprite.scale.x - 0.2, this.sprite.scale.y - 0.2);

    this.addChild(this.sprite);
    this.setParent(parent);

    this.events.on('onHit', (collisor: GameObject) => {
      switch(collisor.name) {
        case "asteroid":
          this.destroy();
          break;
        default: break;
      }
    }, this);
  }

  private onUpdate(dt: number): void {
    const isOutOfBounds = this.position.y <= this.boundingRect.y;
    if (isOutOfBounds) this.destroy();
    else this.position.y += this.direction.y * this.speed.y * dt;
  }

  public shoot(): void {
    this.sprite.visible = true;
    Ticker.shared.add(this.onUpdate, this);
    this.sprite.play();
  }

  public clone(): Projectile {
    return new AutoCannonBullet(this.parent, this.boundingRect);
  }

  public destroy(): void {
    Ticker.shared.remove(this.onUpdate, this);
    super.destroy({ children: true });
  }
}

class AutoCannon implements Weapon {

  public ready: boolean = true;
  public countdown: number = 100;
  private parent: Container;
  private spriteShooting: AnimatedSprite;
  private bullet: Projectile;
  private timer: Timer;

  constructor(parent: Container, bullet: Projectile) {
    this.parent = parent;
    this.bullet = bullet.clone();
    this.timer = new Timer();

    const shootingSheet = Assets.get('mainship_weapons_auto_cannon');
    this.spriteShooting = new AnimatedSprite(shootingSheet.animations['fire']);
    this.spriteShooting.animationSpeed = 0.4;
    this.spriteShooting.anchor.set(0.5);
    this.spriteShooting.loop = false;

    this.spriteShooting.onFrameChange = (currentFrame: number) => {
      if (currentFrame === 2) {
        const clone = this.bullet.clone();
        clone.x = this.spriteShooting.parent.position.x - 8;
        clone.y = this.spriteShooting.parent.position.y - 8;
        clone.shoot();
      }
      if (currentFrame === 3) {
        const clone = this.bullet.clone();
        clone.x = this.spriteShooting.parent.position.x + 8;
        clone.y = this.spriteShooting.parent.position.y - 8;
        clone.shoot();
      }
    }

    this.spriteShooting.onComplete = () => {
      this.spriteShooting.gotoAndStop(0);
      this.timer.timeout(() => {
        this.ready = true;
      }, this.countdown);
    }

    this.spriteShooting.setParent(this.parent);
  }

  public fire(): boolean {
    if (!this.spriteShooting.playing && this.ready) {
      this.ready = false;
      this.spriteShooting.play();
      return true;
    }
    return false;
  }
}

export default class MainShip
  extends GameObject {

  public collisionShape: Circle;

  private motion: Point;
  private friction: number = 0.015;

  private base: Sprite;
  private engine: SpaceshipEngine;

  private boundingRect: AxisAlignedBounds;

  /**
   * Padding bottom;
   */
  private bottom: number = 64;

  private autoCannon: AutoCannon;

  /**
   * Current equiped weapon.
   */
  private weapon: Weapon;

  constructor(parent: Container, boundingRect: AxisAlignedBounds) {
    super("mainship");

    this.boundingRect = boundingRect;
    this.motion = new Point();

    this.engine = new SpaceshipEngine(this);
    this.engine.idle();

    this.autoCannon = new AutoCannon(this, new AutoCannonBullet(parent, boundingRect));
    this.weapon = this.autoCannon;

    this.base = Sprite.from(Assets.get('mainship_base_full_health'));
    this.base.anchor.set(0.5);
    this.base.zIndex = 0;

    this.addChild(this.base);
    this.sortChildren();

    Ticker.shared.add(this.onUpdate, this);
    Input.on('onActionPressed', this.onActionPressed, this);
    Input.on('onActionReleased', this.onActionReleased, this);
  }

  private onActionPressed(action: Actions): void {
    if (action === Actions.MOVE_UP) {
      this.motion.y = -1;
      this.engine.power();
    }
    if (action === Actions.MOVE_LEFT) {
      this.motion.x = 1;
    }
    if (action === Actions.MOVE_RIGHT) {
      this.motion.x = -1;
    }
    if (action === Actions.WEAPON_FIRE) {
      this.weapon.fire();
    }
  }

  private onActionReleased(action: Actions): void {
    if (action === Actions.MOVE_UP) {
      this.engine.idle();
    }
  }

  private onUpdate(dt: number): void {
    const [maxX, minX, minY, maxY] = [0.5, this.friction + 0.015, this.friction + 0.015, 0.5];

    if (this.speed.y > minY && this.speed.y <= maxY) {
      this.speed.y -= this.friction;
    }
    if (this.speed.y >= maxY) {
      this.speed.y = maxY;
    }

    if (this.speed.y < -minY && this.speed.y >= -maxY) {
      this.speed.y += this.friction;
    }
    if (this.speed.y <= -maxY) {
      this.speed.y = -maxY;
    }

    if (this.speed.x > minX && this.speed.x <= maxX) {
      this.speed.x -= this.friction;
    }
    if (this.speed.x >= maxX) {
      this.speed.x = maxX;
    }

    if (this.speed.x < -minX && this.speed.x >= -maxX) {
      this.speed.x += this.friction;
    }
    if (this.speed.x <= -maxX) {
      this.speed.x = -maxX;
    }

    this.motion.x += this.speed.x * dt;
    this.motion.y += this.speed.y * dt;

    this.move(this.motion);
    this.motion.set(0, 0.4);
  }

  private move(offset: Point) {
    this.speed.x += offset.x;
    this.speed.y += offset.y;

    this.position.set(
      this.position.x + offset.x,
      this.position.y + offset.y,
    );

    if (this.position.y >= this.boundingRect.bottom - this.bottom) {
      this.position.set(this.position.x, this.boundingRect.bottom - this.bottom);
    }
    if (this.position.x >= this.boundingRect.right - this.width * 0.5) {
      this.position.set(this.boundingRect.right - this.width * 0.5, this.position.y);
    }
    if (this.position.x <= this.boundingRect.left + this.width * 0.5) {
      this.position.set(this.boundingRect.left + this.width * 0.5, this.position.y);
    }
  }

}
