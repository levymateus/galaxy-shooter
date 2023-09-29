import { AnimatedSprite, Assets, Circle, Sprite } from "pixi.js";
import { AxisAlignedBounds } from "core";
import GameObject from "core/GameObject";
import { randf } from "utils/utils";

export class Asteroid extends GameObject {

  public spriteBase: Sprite;
  public spriteExplode: AnimatedSprite;
  public collisionShape: Circle;

  private boundingRect: AxisAlignedBounds;

  constructor(x: number, y: number, boundingRect: AxisAlignedBounds) {
    super("asteroid");

    this.position.set(x, y);
    this.rotate = randf(0, 0.2);
    this.speed.set(0, randf(0.4, 0.7));
    this.boundingRect = boundingRect;
    this.collisionShape.radius = 20;
    this.spriteBase = Sprite.from(Assets.get('asteroid_base'));
    this.spriteBase.anchor.set(0.5);

    const asteroidSheet = Assets.get('asteroid_explode');
    this.spriteExplode = new AnimatedSprite(asteroidSheet.animations['explode']);
    this.spriteExplode.anchor.set(0.5);
    this.spriteExplode.visible = false;
    this.spriteExplode.loop = false;
    this.spriteExplode.animationSpeed = 0.4;

    this.update = this.onUpdate;
    this.collide = this.onCollide;

    this.addChild(this.spriteBase);
    this.addChild(this.spriteExplode);
  }

  protected onCollide(collisor: GameObject): void {
    if (["mainship"].some(name => collisor.name.includes(name)))
      this.explodeAndDestroy();
  }

  protected onUpdate(dt: number): void {
    this.position.y += this.speed.y * dt;
    this.angle += this.rotate;
    if (this.position.y >= this.boundingRect.bottom) {
      this.destroy({ children: true });
    }
  }

  private explodeAndDestroy(): void {
    this.tiker.stop();
    this.spriteBase.visible = false;
    this.spriteExplode.onComplete = () => this.destroy({
      children: true,
    });
    this.spriteExplode.visible = true;
    this.spriteExplode.play();
  }

}
