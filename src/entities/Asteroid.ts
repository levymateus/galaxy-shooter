import { AnimatedSprite, Assets, Sprite } from "pixi.js";
import { dice, isValidCollisor, randf } from "utils/utils";
import { Entities } from "entities/typings";
import { GameObject } from "core";

enum AsteroidType {
  DEFAULT = 0,
  FAST,
}

export class Asteroid extends GameObject {
  public type: AsteroidType = AsteroidType.DEFAULT;
  private baseSprite: Sprite;
  private explodeSprite: AnimatedSprite;
  private flameSprite: AnimatedSprite | null = null;

  constructor(x?: number, y?: number) {
    super(Entities.ASTEROID);
    this.position.set(x, y);
    this.rotate = randf(0, 0.2);
    this.speed.set(0, randf(0.5, 0.8));
    this.collisionShape.radius = 14;
    this.type = dice(8).roll() >= 6 ? AsteroidType.FAST : this.type;
    this.build();
  }

  private build(): void {
    if (this.type === AsteroidType.FAST) {
      this.speed.y = randf(2, 2.5);
      this.addFlameSprite();
    }
    this.addBaseSprite();
    this.addExplodeSprite();
    this.addListeners();
    this.sortChildren();
  }

  private addBaseSprite(): void {
    this.baseSprite = Sprite.from(Assets.get('asteroid_base'));
    this.baseSprite.anchor.set(this.anchor);
    this.baseSprite.zIndex = 0;
    this.addChild(this.baseSprite);
  }

  private addExplodeSprite(): void {
    const asteroidSheet = Assets.get('asteroid_explode');
    this.explodeSprite = new AnimatedSprite(asteroidSheet.animations['explode']);
    this.explodeSprite.animationSpeed = this.speedAnimation;
    this.explodeSprite.anchor.set(this.anchor);
    this.explodeSprite.visible = false;
    this.explodeSprite.zIndex = 0;
    this.explodeSprite.loop = false;
    this.addChild(this.explodeSprite);
  }

  private addFlameSprite(): void {
    const spritesheet = Assets.get("asteroid_flame");
    this.flameSprite = new AnimatedSprite(spritesheet.animations["flames"]);
    this.flameSprite.animationSpeed = this.speedAnimation;
    this.flameSprite.anchor.set(this.anchor);
    this.flameSprite.zIndex = -1;
    this.flameSprite.angle = 270;
    this.flameSprite.play();
    this.addChild(this.flameSprite);
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
    this.baseSprite.angle += this.rotate;
  }

  private onOutOfBounds(): void {
    return this.destroy({ children: true });
  }

  private explodeAndDestroy(): void {
    this.ticker.stop();
    if (this.flameSprite) this.flameSprite.visible = false;
    this.baseSprite.visible = false;
    this.explodeSprite.visible = true;
    this.explodeSprite.onComplete = () => {
      this.destroy({ children: true, });
    }
    this.explodeSprite.play();
  }

}
