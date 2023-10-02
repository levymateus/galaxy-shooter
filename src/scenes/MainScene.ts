import { Camera, Game, Rectangle, Wrapper } from "core";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { ISceneGraph } from "core/typings";
import { Asteroid } from "entities/Asteroid";
import Background from "entities/Background";
import Entities from "entities/Entities";
import KlaedFighter from "entities/KlaedFighter";
import MainShip from "entities/MainShip";
import { Assets } from "pixi.js";
import { randf } from "utils/utils";

export default class MainScene implements ISceneGraph {

  private static ASTEROIDS_SPAWN_INTERVAL: number = 2000;
  private static KAELD_FIGHTER_SPAWN_INTERVAL: number = 1000;
  private game: Game;
  private wrapper: Wrapper;
  private mainShip: MainShip;
  private asteroidsCount: number = 0;
  private klaedFighterCount: number = 0;

  constructor(game: Game) {
    this.game = game;
  }

  async onStart(wrapper: Wrapper) {
    this.wrapper = wrapper;
    this.wrapper.name = "main_scene";

    const width = this.game.WIDTH;
    const height = this.game.HEIGHT;

    await Assets.loadBundle([
      "enviroments_bundle",
      "mainship_bundle",
      "vfx_bundle",
      "klaed_fighter_bundle"
    ]);

    const background = new Background(new Rectangle(0, 0, width, height));
    const cam = new Camera(wrapper.pivot, this.game);

    this.mainShip = new MainShip(wrapper);

    const klaedFighter = new KlaedFighter(
      wrapper,
      randf(wrapper.bounds.top, wrapper.bounds.right),
      wrapper.bounds.top + 64,
    );
    klaedFighter.setTarget(this.mainShip);

    wrapper.addChild(cam);
    wrapper.addChild(background);
    wrapper.addChild(this.mainShip);
    wrapper.addChild(klaedFighter);
    wrapper.sortChildren();

    wrapper.on('childRemoved', this.handleChildRemoved, this);

    this.spawnAsteroid(wrapper);
    this.spawnKlaedFighter(wrapper);
  }

  private spawnAsteroid(wrapper: Wrapper): void {
    const spawn = () => {
      if (this.asteroidsCount >= 3) return;
      const x = randf(this.wrapper.bounds.left, this.wrapper.bounds.right);
      const y = this.wrapper.bounds.top;
      const asteroid = new Asteroid(x, y);
      wrapper.addChild(asteroid);
      this.asteroidsCount += 1;
    }
    new Timer().interval(spawn, MainScene.ASTEROIDS_SPAWN_INTERVAL);
  }

  private spawnKlaedFighter(wrapper: Wrapper): void {
    const spawn = () => {
      if (this.klaedFighterCount >= 5) return;
      const x = randf(this.wrapper.bounds.top, this.wrapper.bounds.right);
      const y = wrapper.bounds.top;
      const klaedFighter = new KlaedFighter(wrapper, x, y);
      klaedFighter.setTarget(this.mainShip);
      wrapper.addChild(klaedFighter);
      this.klaedFighterCount += 1;
    }
    new Timer().interval(spawn, MainScene.KAELD_FIGHTER_SPAWN_INTERVAL);
  }

  private handleChildRemoved(child: GameObject): void {
    if (child.name === Entities.ASTEROID) {
      this.asteroidsCount--;
    }
    if (child.name === Entities.KLA_ED_FIGHTER) {
      this.klaedFighterCount--;
    }
  }

  public onUpdate(): void {
    // code ...
  }

  async onFinish(): Promise<void> {
    return;
  }
}
