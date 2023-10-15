import { AxisAlignedBounds, CollisionTest, Context, GameObject } from "core";
import { Manager } from "core/Manager";
import { Activity } from "core/typings";
import { DisplayObject } from "pixi.js";
import { SpaceShooterEvents } from "typings";

/**
 * Game Stage Scenes Manager.
 */
export class SceneManager extends Manager<SpaceShooterEvents> { }

export class Scene implements Activity<SpaceShooterEvents> {
  context: Context<SpaceShooterEvents>;
  private area: AxisAlignedBounds;
  private collision: CollisionTest<SpaceShooterEvents, GameObject<SpaceShooterEvents>>;

  async onStart(ctx: Context<SpaceShooterEvents>) {
    this.context = ctx;
    this.area = ctx.bounds.clone().pad(32, 32) as AxisAlignedBounds;
    this.collision = new CollisionTest();
    this.context.on("childAdded", (child) => {
      if (child instanceof GameObject) this.collision.add(child);
    });
  }

  onUpdate(_: number): void {
    this.context.children.forEach(child => {
      this.contains(child);
      this.testCollision(child);
    });
  }

  async onFinish(): Promise<void> {
    this.context.removeAllListeners();
  }

  private contains(child: DisplayObject) {
    if (child instanceof GameObject) {
      const vertex = [{ x: child.x, y: child.y }];
      const notContains = vertex.every(({ x, y }) => !this.area.contains(x, y));
      if (notContains) {
        child.emitter.emit("outOfBounds");
        this.collision.remove(child);
      }
    }
  }

  private async testCollision(child: DisplayObject) {
    if (child instanceof GameObject) {
      this.collision.from(child).forEach(other => {
        other.emitter.emit("onCollide", child);
        child.emitter.emit("onCollide", other);
      });
    }
  }
}
