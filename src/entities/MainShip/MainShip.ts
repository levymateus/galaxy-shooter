import { AxisAlignedBounds, GameObject, Input, Scene, Settings } from "core";
import { Actions, Weapon } from "core/typings";
import { Entities, Entity, KlaedBulletAttributes, MainShipAttributes, isEntity } from "entities/typings";
import { Point } from "pixi.js";
import { isValidCollisor } from "utils/utils";
import { SpaceShooterEvents } from "typings";

import AutoCannon from "./AutoCannon";
import AutoCannonBullet from "./AutoCannonBullet";
import SpaceshipEngine from "./SpaceShipEngine";
import MainShipBase from "./MainShipBase";
import bigExplosion from "vfx/bigExplosion";

export default class MainShip extends GameObject implements Entity<MainShipAttributes> {
  public attributes = {
    maxHealth: 100,
    minHealth: 0,
    health: 100,
  };
  public isDead: boolean = false;
  private scene: Scene<SpaceShooterEvents>;
  private base: MainShipBase;
  private engine: SpaceshipEngine;
  private autoCannon: AutoCannon;
  private weapon: Weapon;
  private maxY: number;

  constructor(scene: Scene<SpaceShooterEvents>) {
    super(Entities.MAIN_SHIP);
    const rect = Settings.getInstance().getDefaultResolution();
    this.scene = scene;
    this.collisionShape.radius = 20;
    this.maxY = rect.width;
    this.addEngine();
    this.addAutoCannon();
    this.addBaseSprite();
    this.addListeners();
    this.sortChildren();
  }

  private addBaseSprite(): void {
    this.base = new MainShipBase(this);
    this.base.changeState('mainship_base_full_health');
  }

  private addAutoCannon(): void {
    this.autoCannon = new AutoCannon(this, new AutoCannonBullet(this.scene));
    this.equipWeapon(this.autoCannon);
  }

  private equipWeapon(weapon: Weapon): void {
    this.weapon = weapon;
    this.weapon.equip();
  }

  private addEngine(): void {
    this.engine = new SpaceshipEngine(this);
    this.engine.idle();
  }

  private addListeners(): void {
    this.update = this.onUpdate;
    this.collide = this.onCollide;
    this.outofbounds = this.onOutOfBounds;
    this.on('added', this.onEnterScene, this);
    Input.on('onActionPressed', this.onActionPressed, this);
    Input.on('onActionReleased', this.onActionReleased, this);
  }

  private onEnterScene(scene: Scene<SpaceShooterEvents>): void {
    this.maxY = scene.bounds.bottom;
    this.position.y = this.maxY - 64;
  }

  private onActionPressed(action: Actions): void {
    if (action === Actions.MOVE_UP) this.speed.y = -1;
    if (action === Actions.MOVE_LEFT) this.speed.x = 1;
    if (action === Actions.MOVE_RIGHT) this.speed.x = -1;
    if (action === Actions.MOVE_DOWN) this.speed.y = 1;
  }

  private onActionReleased(action: Actions): void {
    if (action === Actions.MOVE_UP) this.engine.idle();
  }

  private onUpdate(): void {
    this.weapon.fire();
    if (Math.abs(this.speed.y) >= 1) this.engine.power();
    this.move(this.speed);
    this.speed.set(0, 0);
  }

  private onCollide(collisor: GameObject): void {
    if (isValidCollisor([Entities.KLA_ED_FIGHTER, Entities.ASTEROID], collisor))
      this.takeDamage(this.attributes.maxHealth);
    if (
      isValidCollisor([Entities.KLA_ED_BULLET], collisor)
      && isEntity<KlaedBulletAttributes>(collisor)
    ) this.takeDamage(collisor.attributes.damage);
  }

  private onOutOfBounds(bounds: AxisAlignedBounds): void {
    if (this.y < bounds.top) this.y = bounds.top;
    if (this.x > bounds.right) this.x = bounds.right;
    if (this.y > bounds.bottom) this.y = bounds.bottom;
    if (this.x < bounds.left) this.x = bounds.left;
  }

  private move(offset: Point) {
    this.speed.x += offset.x;
    this.speed.y += offset.y;
    this.position.set(
      this.position.x + offset.x,
      this.position.y + offset.y,
    );
    if (this.position.y >= this.maxY - 64) {
      this.position.set(this.position.x, this.maxY - 64);
    }
  }

  public takeDamage(damage: number): void {
    if (this.isDead) return;

    this.attributes.health -= damage;

    const partialValue = this.attributes.health;
    const fullValue = this.attributes.maxHealth;
    const percent = (100 * partialValue) / fullValue;

    if (percent >= fullValue - (fullValue * 0.02)) {
      this.base.changeState('mainship_base_full_health');
    }
    if (percent < fullValue - (fullValue * 0.02) && percent > fullValue - (fullValue * 0.5)) {
      this.base.changeState('mainship_base_slight_damaged');
    }
    if (percent <= fullValue - (fullValue * 0.5) && percent > fullValue - (fullValue * 0.75)) {
      this.base.changeState('mainship_base_damaged');
    }
    if (percent <= fullValue - (fullValue * 0.75) && percent > 0) {
      this.base.changeState('mainship_base_very_damaged');
    }
    if (percent <= this.attributes.minHealth) this.dead();
  }

  public dead() {
    if (this.isDead) return;

    this.isDead = true;
    this.visible = false;
    this.collisionTest = false;

    const config = bigExplosion();
    config.pos.x = this.x; config.pos.y = this.y;
    this.scene.emitter.emit("dispathVFX", config);

    this.ticker.stop();
    this.weapon?.unequip();
    this.scene.emitter.emit("gameOver");
  }
}
