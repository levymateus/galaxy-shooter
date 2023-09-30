import GameObject from "core/GameObject";
import { AnimatedSprite, Assets, Circle, Sprite } from "pixi.js";
import { isValidCollisor, randf } from "utils/utils";
import Entities from "./Entities";

export class Asteroid extends GameObject {

  public baseSprite: Sprite;
  public explodeSprite: AnimatedSprite;
  public collisionShape: Circle;

  constructor(x?: number, y?: number) {
    super(Entities.ASTEROID);
    this.position.set(x, y);
    this.rotate = randf(0, 0.2);
    this.speed.set(0, randf(0.4, 0.7));
    this.collisionShape.radius = 14;
    this.addBaseSprite();
    this.addExplodeSprite();
    this.addListeners();
  }

  private addBaseSprite(): void {
    this.baseSprite = Sprite.from(Assets.get('asteroid_base'));
    this.baseSprite.anchor.set(this.anchor);
    this.addChild(this.baseSprite);
  }

  private addExplodeSprite(): void {
    const asteroidSheet = Assets.get('asteroid_explode');
    this.explodeSprite = new AnimatedSprite(asteroidSheet.animations['explode']);
    this.explodeSprite.animationSpeed = this.speedAnimation;
    this.explodeSprite.anchor.set(this.anchor);
    this.explodeSprite.visible = false;
    this.explodeSprite.loop = false;
    this.addChild(this.explodeSprite);
  }

  private addListeners(): void {
    this.update = this.onUpdate;
    this.collide = this.onCollide;
    this.outofbounds = this.onOutOfBounds;
  }

  private onCollide(collisor: GameObject): void {
    if (isValidCollisor([Entities.MAIN_SHIP], collisor)) return this.explodeAndDestroy();
  }

  private onUpdate(dt: number): void {
    this.position.y += this.speed.y * dt;
    this.angle += this.rotate;
  }

  private onOutOfBounds(): void {
    return this.destroy({ children: true });
  }

  private explodeAndDestroy(): void {
    this.ticker.stop();
    this.baseSprite.visible = false;
    this.explodeSprite.visible = true;
    this.explodeSprite.onComplete = () => {
      this.destroy({ children: true, });
    }
    this.explodeSprite.play();
  }

}
