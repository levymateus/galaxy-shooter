import { AxisAlignedBounds } from "core";
import GameObject from "core/GameObject";
import { AnimatedSprite, Assets, Circle, IDestroyOptions, Sprite, Ticker } from "pixi.js";
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
    this.speed.set(0, randf(0.2, 1));
    this.boundingRect = boundingRect;
    this.collisionShape.radius = 14;
    this.spriteBase = Sprite.from(Assets.get('asteroid_base'));
    this.spriteBase.anchor.set(0.5);

    const asteroidSheet = Assets.get('asteroid_explode');
    this.spriteExplode = new AnimatedSprite(asteroidSheet.animations['explode']);
    this.spriteExplode.anchor.set(0.5);
    this.spriteExplode.visible = false;
    this.spriteExplode.loop = false;
    this.spriteExplode.animationSpeed = 0.4;

    this.addChild(this.spriteBase);
    this.addChild(this.spriteExplode);

    this.events.on('onHit', this.explode, this);

    Ticker.shared.add(this.onUpdate, this);
  }

  private onUpdate(dt: number): void {
    this.position.y += this.speed.y * dt;
    this.angle += this.rotate;
    if (this.position.y >= this.boundingRect.bottom) {
      this.destroy({ children: true });
    }
  }

  private explodeAndDestroy(): void {
    this.spriteBase.visible = false;
    this.spriteExplode.onComplete = () => this.destroy({
      children: true,
    });
    this.spriteExplode.visible = true;
    this.spriteExplode.play();
  }

  private explode(collisor: GameObject): void {
    if (collisor.name.includes("bullet")) this.explodeAndDestroy();
  }

  public destroy(options?: boolean | IDestroyOptions | undefined): void {
    Ticker.shared.remove(this.onUpdate, this);
    this.events.removeListener('onHit', this.explode, this);
    super.destroy(options);
  }
}
