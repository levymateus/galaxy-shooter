import { Point } from "@pixi/math";
import { AxisAlignedBounds, Context, GameObject } from "core";
import { Projectile } from "core/typings";
import { Entities, Entity, KlaedBulletAttributes } from "entities/typings";
import { AnimatedSprite, Assets } from "pixi.js";
import { SpaceShooterEvents } from "typings";
import { isValidCollisor } from "utils/utils";
import smallExplosion from "vfx/smallExplosion";

export default class KlaedBullet extends GameObject implements Projectile, Entity<KlaedBulletAttributes> {
  public attributes = {
    damage: 10,
  };
  public direction: Point;
  private context: Context<SpaceShooterEvents>;
  private baseSprite: AnimatedSprite;
  private bounds: AxisAlignedBounds;

  constructor(context: Context<SpaceShooterEvents>, bounds: AxisAlignedBounds) {
    super(Entities.KLA_ED_BULLET);
    this.context = context;
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
    this.setParent(this.context);
    this.addChild(this.baseSprite);
  }

  private onCollides(collisor: GameObject): void {
    if (isValidCollisor([Entities.MAIN_SHIP], collisor)) {
      this.explode();
      return this.destroy({ children: true });
    };
  }

  private onOutOfBounds(): void {
    return this.destroy({ children: true });
  }

  private explode(): void {
    const config = smallExplosion();
    config.pos.x = this.x;
    config.pos.y = this.y;
    this.context.emitter.emit("dispathVFX", config);
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
    return new KlaedBullet(this.context, this.bounds);
  }
}
