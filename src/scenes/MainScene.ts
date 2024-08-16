import { Spawner } from "app/typings"
import { Context, Timer, Unique } from "core"
import { Asteroid } from "entities/Asteroid"
import Player from "entities/Player"
import { Scene } from "managers/SceneManager"
import { Point } from "pixi.js"
import { MathUtils } from "utils/utils"

class AsteroidsSpawner implements Spawner {
  private static MAX_ASTEROIDS_COUNT = 3

  private asteroids: Asteroid[] = []
  private frequency = (1 / 1) * 1000
  private timer = new Timer()

  constructor(
    public readonly ctx: Context,
  ) { }

  private canCreate() {
    return this.asteroids.length < AsteroidsSpawner.MAX_ASTEROIDS_COUNT
  }

  private async createAsteroid() {
    const asteroid = await this.ctx.create<Asteroid>(Asteroid)
    asteroid.position.set(
      MathUtils.randf(this.ctx.bounds.x, this.ctx.bounds.right),
      this.ctx.bounds.y,
    )
    this.asteroids.push(asteroid)
  }

  private removeAsteroid(arg: Unique) {
    const index = this.asteroids.findIndex((item) => arg.equal(item))
    this.asteroids.splice(index, 1)
  }

  async spawn() {
    this.ctx.on("childRemoved", (child) => {
      if (child instanceof Asteroid) {
        this.removeAsteroid(child)
        if (this.canCreate()) {
          this.createAsteroid()
        }
      }
    })
    this.timer.interval(() => {
      if (this.canCreate()) {
        this.createAsteroid()
      }
    }, this.frequency)
  }

  async revoke() {
    this.asteroids.forEach((asteroid) => asteroid.removeChild())
  }
}

class PlayerSpawner implements Spawner {
  private player: Player

  constructor(
    public readonly ctx: Context,
  ) { }

  async spawn(point: Point) {
    this.player = await this.ctx.create<Player>(Player)
    this.player.position.set(point.x, point.y)
  }

  async revoke() {
    this.player.removeChild()
  }
}

export default class MainScene extends Scene {
  private asteroidsSpawner: AsteroidsSpawner
  private playerSpawner: PlayerSpawner

  async onStart(ctx: Context): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)

    this.playerSpawner = new PlayerSpawner(ctx)
    this.playerSpawner.spawn(new Point(0, 0))

    this.asteroidsSpawner = new AsteroidsSpawner(ctx)
    this.asteroidsSpawner.spawn()

    console.log('MAIN SCENE START!')
  }

  onUpdate(_: number): void {
    // Empty.
  }

  async onFinish(): Promise<void> {
    this.playerSpawner.revoke()
    this.asteroidsSpawner.revoke()
  }
}
