import { GameObject } from "core";
import { Projectile } from "core/typings";
import { Entities } from "entities/typings";
import { AnimatedSprite, Assets, Container, Point } from "pixi.js";
import { isValidCollisor } from "utils/utils";

export default class AutoCannonBullet extends GameObject implements Projectile {
  public direction: Point;
  private scene: Container;
  private bulletSprite: AnimatedSprite;

  constructor(scene: Container) {
    super(Entities.CANNON_BULLET);
    this.speed.set(0, 10);
    this.scene = scene;
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
    this.setParent(this.scene);
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
    return new AutoCannonBullet(this.scene);
  }
}
