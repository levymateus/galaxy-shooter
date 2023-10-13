import {
  Context,
  GameObject,
  Rectangle,
  Timer
} from "core";
import { Activity } from "core/SceneManager";
import { Asteroid } from "entities/Asteroid";
import ParallaxStarryBackground from "entities/ParallaxStarryBackground";
import KlaEdFighter from "entities/KlaEdFighter/KlaEdFighter";
import MainShip from "entities/MainShip/MainShip";
import { Entities } from "entities/typings";
import { SpaceShooterEvents } from "typings";
import { randf } from "utils/utils";

export default class MainScene extends Activity<SpaceShooterEvents> {
  public static SCENE_NAME = "main_scene";
  private static ASTEROIDS_SPAWN_INTERVAL: number = 1;
  private static KAELD_FIGHTER_SPAWN_INTERVAL: number = 1;

  private mainShip: MainShip;
  private asteroidsCount: number;
  private klaedFighterCount: number;

  private timer1: Timer;
  private timer2: Timer;

  async onStart(context: Context<SpaceShooterEvents>) {
    super.onStart(context);

    this.asteroidsCount = 0;
    this.klaedFighterCount = 0;

    const width = context.surface.width;
    const height = context.surface.height;
    const background = new ParallaxStarryBackground(new Rectangle(0, 0, width, height));
    this.context.addChild(background);

    this.mainShip = new MainShip(this.context);
    this.context.addChild(this.mainShip);

    const spawnAsteroid = () => {
      if (this.asteroidsCount >= 32) return;
      const x = randf(this.context.bounds.left, this.context.bounds.right);
      const y = this.context.bounds.top;
      const asteroid = new Asteroid(x, y);
      this.context.addChild(asteroid);
      this.asteroidsCount += 1;
    }
    this.timer1 = new Timer();
    this.timer1.interval(spawnAsteroid, MainScene.ASTEROIDS_SPAWN_INTERVAL);

    const spawnKlaEdFighter = () => {
      if (this.klaedFighterCount >= 32) return;
      const x = randf(this.context.bounds.top, this.context.bounds.right);
      const y = this.context.bounds.top;
      const fighter = new KlaEdFighter(this.context, x, y);
      if (!this.mainShip.isDead) fighter.setTarget(this.mainShip);
      this.context.addChild(fighter);
      this.klaedFighterCount += 1;
    }
    this.timer2 = new Timer();
    this.timer2.interval(spawnKlaEdFighter, MainScene.KAELD_FIGHTER_SPAWN_INTERVAL);

    const handleChildRemoved = (child: GameObject) => {
      if (child.name === Entities.ASTEROID) this.asteroidsCount--;
      if (child.name === Entities.KLA_ED_FIGHTER) this.klaedFighterCount--;
    }

    context.on('childRemoved', handleChildRemoved);
    context.sortChildren();
  }

  public onUpdate(): void {
    // code ...
  }
}
