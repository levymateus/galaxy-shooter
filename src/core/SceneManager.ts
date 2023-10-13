import { AxisAlignedBounds, CollisionTest, Context, EventEmitter, GameObject, Surface } from 'core';
import { Manager } from "core/Manager";
import { Activity as ActivityInterface, isGameObject, isKinematicBody } from 'core/typings';
import { Application, utils } from 'pixi.js';

export class SceneManager<E extends utils.EventEmitter.ValidEventTypes> extends Manager<E> {
  constructor(app: Application, surface: Surface, bounds: AxisAlignedBounds, emitter: EventEmitter<E>) {
    super(app, surface, bounds, emitter);
  }
}

/**
 * Scene class is the main container of the current Scene.
 * Control the bounds, notify the direct children.
 */
export class Activity<E extends utils.EventEmitter.ValidEventTypes> implements ActivityInterface<E> {
  public ct: CollisionTest;
  protected context: Context<E>;

  private childrenIsInBounds() {
    const padding = {
      right: 0,
      bottom: 0,
      left: 0,
      top: 0,
    };
    this.context.children.forEach((child: GameObject) => {
      const isValid = isGameObject(child) && child?.events?.emit
      if (!isValid) return;
      const childBounds = child;
      const bounds = this.context.bounds;
      const isOutOfBounds =
        childBounds.x + padding.left < bounds.left
        || childBounds.x + padding.right > bounds.right
        || childBounds.y + padding.bottom > bounds.bottom
        || childBounds.y + padding.top < bounds.top;
      if (isOutOfBounds) child.events.emit('outOfWorldBounds', bounds);
    });
  }

  private childrenIsColliding() {
    const collsn = this.ct.collisions();
    collsn.forEach(([objA, objB]) => {
      if (isKinematicBody(objA) && isKinematicBody(objB)) {
        objA.events.emit('onCollide', objB);
      }
    });
  }

  async onStart(context: Context<E>) {
    this.context = context;
    this.ct = new CollisionTest();
    this.context.manager.ticker.add(this.childrenIsInBounds, this);
    this.context.manager.ticker.add(this.childrenIsColliding, this);

    const handleChildAdded = (child: GameObject) => {
      if (isKinematicBody(child)) this.ct.add(child);
    };

    const handleChildRemoved = (child: GameObject) => {
      this.ct.remove(child);
    }

    this.context.on('childAdded', handleChildAdded);
    this.context.on('childRemoved', handleChildRemoved);
  }

  public onUpdate(_: number): void {
    throw new Error('Method not implemented.');
  }

  public async onFinish(): Promise<void> {
    this.context.manager.ticker.remove(this.childrenIsInBounds, this);
    this.context.manager.ticker.remove(this.childrenIsColliding, this);
  }
}
