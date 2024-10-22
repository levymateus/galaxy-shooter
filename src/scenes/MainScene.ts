import { Context, Timer, Unique } from "core"
import { Asteroid } from "entities/Asteroid"
import KlaEdFighter from "entities/KlaEdFighter"
import Player from "entities/Player"
import { Scene } from "managers/SceneManager"
import { Point } from "pixi.js"
import { Spawner } from "typings/typings"
import { MathUtils } from "utils/utils"

class AsteroidsSpawner implements Spawner {
  private static MAX_ASTEROIDS_COUNT = 4

  private asteroids: Asteroid[] = []
  private frequency = 3000
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
    this.timer.interval(this.frequency, () => {
      if (this.canCreate()) {
        this.createAsteroid()
      }
    })
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

class KlaEdFighterSpawner implements Spawner {
  private static MAX_KLAED_FIGHTERS = 5

  private klaedFighters: KlaEdFighter[] = []
  private frequency = 3000
  private timer = new Timer()

  constructor(
    public readonly ctx: Context,
  ) { }

  private canCreate() {
    return this.klaedFighters.length < KlaEdFighterSpawner.MAX_KLAED_FIGHTERS
  }

  private removeKlaEdFighter(arg: Unique) {
    const index = this.klaedFighters.findIndex((item) => arg.equal(item))
    this.klaedFighters.splice(index, 1)
  }

  private async createKlaEdFighter() {
    const klaedFighter = await this.ctx.create<KlaEdFighter>(KlaEdFighter)
    klaedFighter.offset =
      MathUtils.randi(this.ctx.bounds.left, this.ctx.bounds.right)
    klaedFighter.position.set(
      klaedFighter.offset,
      this.ctx.bounds.y,
    )
    this.klaedFighters.push(klaedFighter)
  }

  async spawn() {
    this.ctx.on("childRemoved", (child) => {
      if (child instanceof KlaEdFighter) {
        this.removeKlaEdFighter(child)
        if (this.canCreate()) {
          this.createKlaEdFighter()
        }
      }
    })
    this.timer.interval(this.frequency, () => {
      if (this.canCreate()) {
        this.createKlaEdFighter()
      }
    })
  }

  async revoke() {
    this.klaedFighters.forEach((klaedFighter) => {
      klaedFighter.removeChild()
    })
  }
}

export default class MainScene extends Scene {
  private asteroidsSpawner: AsteroidsSpawner
  private playerSpawner: PlayerSpawner
  private klaedFighterSpawner: KlaEdFighterSpawner

  async onStart(ctx: Context): Promise<void> {
    super.onStart(ctx)
    ctx.anchor.set(-0.5)

    this.playerSpawner = new PlayerSpawner(ctx)
    this.playerSpawner.spawn(new Point(0, 0))

    this.asteroidsSpawner = new AsteroidsSpawner(ctx)
    this.asteroidsSpawner.spawn()

    this.klaedFighterSpawner = new KlaEdFighterSpawner(ctx)
    this.klaedFighterSpawner.spawn()
  }

  onUpdate(_: number): void {
    // Empty.
  }

  async onFinish(): Promise<void> {
    this.playerSpawner.revoke()
    this.asteroidsSpawner.revoke()
  }
}
