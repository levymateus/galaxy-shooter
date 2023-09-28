import { AxisAlignedBounds, Camera, Game, Rectangle } from "core";
import CollisionTest from "core/CollisionTest";
import GameObject from "core/GameObject";
import Timer from "core/Timer";
import { ISceneGraph, KinematicBody, isKinematicBody } from "core/typings";
import { Asteroid } from "entities/Asteroid";
import Background from "entities/Background";
import MainShip from "entities/MainShip";
import { Assets, Container } from "pixi.js";
import { randf } from "utils/utils";

export default class MainScene implements ISceneGraph {

  private game: Game;
  private mainShip: MainShip;
  private axisAlignedBounds: AxisAlignedBounds;
  private collisionTest: CollisionTest;
  private asteroidsCount: number = 0;
  private asteroidsSpawnInterval: number = 1000;

  constructor(game: Game) {
    this.game = game;
  }

  async onStart(container: Container) {
    container.name = "main_scene";

    const width = this.game.WIDTH;
    const height = this.game.HEIGHT;

    await Assets.loadBundle("enviroments_bundle");
    await Assets.loadBundle("mainship_bundle");

    const background = new Background(new Rectangle(0, 0, width, height));
    const cam = new Camera(container.pivot, this.game);

    this.collisionTest = new CollisionTest();
    this.axisAlignedBounds = new AxisAlignedBounds(0, 0, width, height);
    this.axisAlignedBounds.anchor.set(0.5);
    this.mainShip = new MainShip(container, this.axisAlignedBounds);

    this.collisionTest.add(this.mainShip);

    container.addChild(cam);
    container.addChild(background);
    container.addChild(this.mainShip);
    container.sortChildren();

    container.on('childAdded', this.handleChildAdded, this);
    container.on('childRemoved', this.handleChildRemoved, this);

    this.spawnAsteroid(container);
  }

  private spawnAsteroid(container: Container): void {
    new Timer().interval(() => {
      if (this.asteroidsCount <= 3) {
        const asteroid = new Asteroid(
          randf(this.axisAlignedBounds.left, this.axisAlignedBounds.right),
          this.axisAlignedBounds.top,
          this.axisAlignedBounds,
        );
        container.addChild(asteroid);
        this.asteroidsCount++;
      }
    }, this.asteroidsSpawnInterval);
  }

  private handleChildAdded(child: GameObject): void {
    this.collisionTest.add(child);
  }

  private handleChildRemoved(child: GameObject): void {
    if (child.name === "asteroid") {
      this.asteroidsCount--;
    }
    this.collisionTest.remove(child);
  }

  public onUpdate(): void {
    const collsn = this.collisionTest.collisions();
    collsn.forEach(([a, b]) => {
      if (isKinematicBody(a) && isKinematicBody(b)) {
        a.events.emit('onHit', b as Container & KinematicBody);
      }
    });
  }

  async onFinish(): Promise<void> {
    return;
  }
}
