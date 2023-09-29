import { AxisAlignedBounds, Camera, Game, Rectangle } from "core";
import CollisionTest from "core/CollisionTest";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { ISceneGraph, KinematicBody, isKinematicBody } from "core/typings";
import { Asteroid } from "entities/Asteroid";
import Background from "entities/Background";
import KlaedFighter from "entities/KlaedFighter";
import MainShip from "entities/MainShip";
import { Assets, Container } from "pixi.js";
import { randf } from "utils/utils";

export default class MainScene implements ISceneGraph {

  private game: Game;
  private mainShip: MainShip;
  private axis: AxisAlignedBounds;
  private collisionTest: CollisionTest;

  private asteroidsCount: number = 0;
  private klaedFighterCount: number = 0;

  private ASTEROIDS_SPAWN_INTERVAL: number = 1000;
  private KAELD_FIGHTER_SPAWN_INTERVAL: number = 500;

  constructor(game: Game) {
    this.game = game;
  }

  async onStart(container: Container) {
    container.name = "main_scene";

    const width = this.game.WIDTH;
    const height = this.game.HEIGHT;

    await Assets.loadBundle([
      "enviroments_bundle",
      "mainship_bundle",
      "klaed_fighter"
    ]);

    const background = new Background(new Rectangle(0, 0, width, height));
    const cam = new Camera(container.pivot, this.game);

    this.collisionTest = new CollisionTest();
    this.axis = new AxisAlignedBounds(0, 0, width, height);
    this.axis.anchor.set(0.5);
    this.mainShip = new MainShip(container, this.axis);
    this.mainShip.y = this.axis.bottom + 64;

    const klaedFighter = new KlaedFighter(
      container,
      this.axis,
      randf(this.axis.top, this.axis.right),
      this.axis.top + 64,
    );
    klaedFighter.axis = this.axis;
    klaedFighter.setTarget(this.mainShip);

    this.collisionTest.add(klaedFighter);
    this.collisionTest.add(this.mainShip);

    container.addChild(cam);
    container.addChild(background);
    container.addChild(this.mainShip);
    container.addChild(klaedFighter);
    container.sortChildren();

    container.on('childAdded', this.handleChildAdded, this);
    container.on('childRemoved', this.handleChildRemoved, this);

    this.spawnAsteroid(container);
    this.spawnKlaedFighter(container);
  }

  private spawnAsteroid(container: Container): void {
    new Timer().interval(() => {
      if (this.asteroidsCount < 3) {
        const asteroid = new Asteroid(
          randf(this.axis.left, this.axis.right),
          this.axis.top,
          this.axis,
        );
        container.addChild(asteroid);
        this.asteroidsCount++;
      }
    }, this.ASTEROIDS_SPAWN_INTERVAL);
  }

  private spawnKlaedFighter(container: Container): void {
    new Timer().interval(() => {
      if (this.klaedFighterCount < 1) {
        const klaedFighter = new KlaedFighter(
          container,
          this.axis,
          randf(this.axis.top, this.axis.right),
          this.axis.top,
        );
        klaedFighter.axis = this.axis;
        klaedFighter.setTarget(this.mainShip);
        container.addChild(klaedFighter);
        this.klaedFighterCount++;
      }
    }, this.KAELD_FIGHTER_SPAWN_INTERVAL);
  }

  private handleChildAdded(child: GameObject): void {
    this.collisionTest.add(child);
  }

  private handleChildRemoved(child: GameObject): void {
    if (child.name === "asteroid") {
      this.asteroidsCount--;
    }
    if (child.name === "klaed_fighter") {
      this.klaedFighterCount--;
    }
    this.collisionTest.remove(child);
  }

  public onUpdate(): void {
    const collsn = this.collisionTest.collisions();
    collsn.forEach(([a, b]) => {
      if (isKinematicBody(a) && isKinematicBody(b)) {
        a.events.emit('onCollide', b as Container & KinematicBody);
      }
    });
  }

  async onFinish(): Promise<void> {
    return;
  }
}
