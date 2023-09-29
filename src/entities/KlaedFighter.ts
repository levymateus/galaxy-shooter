import * as M from "@pixi/math";
import { AxisAlignedBounds } from "core";
import GameObject from "core/GameObject";
import { AnimatedSprite, Assets, Point, RAD_TO_DEG, Sprite } from "pixi.js";

/**
 * Fighter é um camicase que tenta se explodir no jogador para causar dano.
 */
export default class KlaedFighter extends GameObject {

  private direction: Point;
  private spriteBase: Sprite;
  private spriteEngine: AnimatedSprite;
  private spriteDestruction: AnimatedSprite;
  private target: GameObject | null = null;

  public targetMinDistance: number = 256;
  public axis: AxisAlignedBounds;

  constructor(x: number, y: number) {
    super("klaed_fighter");

    this.angle = 180;
    this.position.set(x, y);
    this.speed.set(2, 2);
    this.collisionShape.radius = 16;
    this.direction = new Point(0, 1);
    this.axis = new AxisAlignedBounds();
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

  private sinMoving(dt: number): void {
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
    if (["mainship", "bullet"].some(name => collisor.name.includes(name))) {
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
