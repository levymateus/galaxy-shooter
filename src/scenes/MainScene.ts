import { GameObject, Rectangle, Scene, Surface, Timer } from "core";
import { Activity } from "core/typings";
import { Asteroid } from "entities/Asteroid";
import Background from "entities/Background";
import KlaEdFighter from "entities/KlaEdFighter/KlaEdFighter";
import MainShip from "entities/MainShip/MainShip";
import { Entities } from "entities/typings";
import { SpaceShooterEvents } from "typings";
import { randf } from "utils/utils";

export default class MainScene implements Activity<SpaceShooterEvents> {
  public static SCENE_NAME = "main_scene";
  private static ASTEROIDS_SPAWN_INTERVAL: number = 2000;
  private static KAELD_FIGHTER_SPAWN_INTERVAL: number = 1000;
  public name: string;
  private surface: Surface;
  private mainShip: MainShip;
  private asteroidsCount: number = 0;
  private klaedFighterCount: number = 0;
  private scene: Scene<SpaceShooterEvents>;

  constructor(surface: Surface) {
    this.surface = surface;
  }

  async onStart(scene: Scene<SpaceShooterEvents>) {
    scene = scene;
    scene.name = MainScene.SCENE_NAME;
    this.name = MainScene.SCENE_NAME;
    this.scene = scene;
    const width = this.surface.width;
    const height = this.surface.height;
    this.addBackground(width, height);
    this.addPlayer();
    this.addListeners();
    this.addAsteroids();
    this.addKlaedFighters();
    scene.sortChildren();
  }

  private async addBackground(width: number, height: number) {
    const background = new Background(new Rectangle(0, 0, width, height));
    this.scene.addChild(background);
  }

  private addListeners(): void {
    this.scene.on('childRemoved', this.handleChildRemoved, this);
  }

  private addAsteroids(): void {
    const spawn = () => {
      if (this.asteroidsCount >= 3) return;
      const x = randf(this.scene.bounds.left, this.scene.bounds.right);
      const y = this.scene.bounds.top;
      const asteroid = new Asteroid(x, y);
      this.scene.addChild(asteroid);
      this.asteroidsCount += 1;
    }
    new Timer().interval(spawn, MainScene.ASTEROIDS_SPAWN_INTERVAL);
  }

  private addPlayer(): void {
    this.mainShip = new MainShip(this.scene);
    this.scene.addChild(this.mainShip);
  }

  private addKlaedFighters(): void {
    const spawn = () => {
      if (this.klaedFighterCount >= 5) return;
      const x = randf(this.scene.bounds.top, this.scene.bounds.right);
      const y = this.scene.bounds.top;
      const fighter = new KlaEdFighter(this.scene, x, y);
      if (!this.mainShip.isDead) fighter.setTarget(this.mainShip);
      this.scene.addChild(fighter);
      this.klaedFighterCount += 1;
    }
    new Timer().interval(spawn, MainScene.KAELD_FIGHTER_SPAWN_INTERVAL);
  }

  private handleChildRemoved(child: GameObject): void {
    if (child.name === Entities.ASTEROID) this.asteroidsCount--;
    if (child.name === Entities.KLA_ED_FIGHTER) this.klaedFighterCount--;
  }

  public onUpdate(): void {
    // code ...
  }

  async onFinish(): Promise<void> {
    return;
  }
}
