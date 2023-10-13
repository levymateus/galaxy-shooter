import { Point } from "@pixi/math";
import { AxisAlignedBounds, Context, GameObject } from "core";
import { Entities } from "entities/typings";
import { AnimatedSprite, Assets, Sprite } from "pixi.js";
import { SpaceShooterEvents } from "typings";
import { DOWN, angleBetween, dice, isValidCollisor, randf } from "utils/utils";

import KlaEdBullet from "./KlaEdBullet";
import KlaedFighterWeapons from "./KlaEdFighterWeapons";

export default class KlaedFighter extends GameObject {
  private static TARGET_MIN_DISTANCE: number = 256;
  public bounds: AxisAlignedBounds;
  public attributes = { score: 10 };
  private direction: Point;
  private baseSprite: Sprite;
  private engineSprite: AnimatedSprite;
  private destructionSprite: AnimatedSprite;
  private target: GameObject | null = null;
  private weapons: KlaedFighterWeapons | null = null;
  private context: Context<SpaceShooterEvents>;
  private isKamikaze: boolean = false;

  constructor(context: Context<SpaceShooterEvents>, x?: number, y?: number) {
    super(Entities.KLA_ED_FIGHTER);
    this.context = context;
    this.position.set(x, y);
    this.speed.set(2, 2);
    this.collisionShape.radius = 14;
    this.direction = DOWN;
    this.angle = this.direction.y * 180;
    this.addBaseSprite();
    this.addEngineSprite();
    this.addDestructionSprite();
    this.addWeapons();
    this.addListeners();
  }

  private addBaseSprite(): void {
    this.baseSprite = Sprite.from(Assets.get("klaed_fighter_base"));
    this.baseSprite.anchor.set(this.anchor);
    this.addChild(this.baseSprite);
  }

  private addEngineSprite(): void {
    const spritesheet = Assets.get("klaed_fighter_engine");
    this.engineSprite = new AnimatedSprite(spritesheet.animations["engine"]);
    this.engineSprite.animationSpeed = this.speedAnimation;
    this.engineSprite.anchor.set(this.anchor);
    this.engineSprite.play();
    this.addChild(this.engineSprite);
  }

  private addDestructionSprite(): void {
    const spritesheet = Assets.get("klaed_fighter_destruction");
    this.destructionSprite = new AnimatedSprite(spritesheet.animations["destruction"]);
    this.destructionSprite.animationSpeed = this.speedAnimation;
    this.destructionSprite.anchor.set(this.anchor);
    this.destructionSprite.loop = false;
    this.destructionSprite.visible = false;
    this.addChild(this.destructionSprite);
  }

  private addWeapons(): void {
    const shouldEquipWeapons = dice(2).roll() >= 2;
    if (shouldEquipWeapons) {
      this.weapons = new KlaedFighterWeapons(this, new KlaEdBullet(this.context, this.bounds))
      this.weapons.countdown = randf(300, 1000);
      return this.weapons.equip();
    }
    return;
  }

  private addListeners(): void {
    this.isKamikaze = dice(2).roll() >= 2;
    this.update = this.isKamikaze ? this.kamikaze : this.sinMoving;
    this.collide = this.onCollide;
    this.outofbounds = this.onOutOfBounds;
    this.context.emitter.on("gameOver", this.cleanup, this);
  }

  private cleanup(): void {
    this.target = null;
    this.isKamikaze = false;
  }

  private onOutOfBounds(bounds: AxisAlignedBounds): void {
    if (this.isKamikaze) return this.destroy({ children: true });
    if (this.y > bounds.bottom) return this.destroy({ children: true });
  }

  private kamikaze(dt: number): void {
    if (this.target) this.target = this.attack(this.target);
    this.position.y -= this.direction.y * this.speed.y * dt;
    this.position.x -= this.direction.x * this.speed.x * dt;
  }

  private attack(target: GameObject): GameObject | null {
    const dist = new Point(this.x, this.y).subtract(target.position);
    this.direction = dist.normalize();
    if (dist.magnitude() <= KlaedFighter.TARGET_MIN_DISTANCE) {
      this.engineSprite.animationSpeed += 0.3;
      this.speed = this.speed.add(new Point(3, 3));
      return null;
    }
    this.angle = angleBetween(this.getGlobalPosition(), target.getGlobalPosition()) - 270;
    return target;
  }

  private sinMoving(dt: number): void {
    this.weapons?.fire();
    this.position.y += this.direction.y * this.speed.y * dt;
    this.position.x += Math.sin(this.position.y * 0.01);
  }

  protected onCollide(collisor: GameObject): void {
    if (isValidCollisor([Entities.MAIN_SHIP, Entities.CANNON_BULLET], collisor)) {
      this.context.emitter.emit("scoreIncrement", this.attributes.score);
      return this.explodeAndDestroy();
    }
  }

  public setTarget(target: GameObject): void {
    this.target = target;
  }

  public explodeAndDestroy(): void {
    this.ticker.stop();
    this.weapons?.unequip();
    this.collisionTest = false;
    this.baseSprite.visible = false;
    this.engineSprite.visible = false;
    this.destructionSprite.visible = true;
    this.destructionSprite.onComplete = () => {
      super.destroy({ children: true });
    }
    this.destructionSprite.play();
  }
}
