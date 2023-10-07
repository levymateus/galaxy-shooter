import { AxisAlignedBounds, EventEmitter, GameObject, SceneManager } from "core";
import CollisionTest from 'core/CollisionTest';
import { KinematicBody, isGameObject, isKinematicBody } from "core/typings";
import { Container, Graphics, IDestroyOptions, Ticker, utils } from 'pixi.js';

/**
 * Scene class is the main container of the current Scene.
 * Controls the bounds, notify the direct children.
 */
export class Scene<E extends utils.EventEmitter.ValidEventTypes> extends Container {
  private static BOUNDING_RECT_PADDING = 2;
  public sceneManager: SceneManager<E>;
  public bounds: AxisAlignedBounds;
  public emitter: EventEmitter<E>;
  private ticker: Ticker;
  private collisionTest: CollisionTest;

  constructor(bounds: AxisAlignedBounds) {
    super();
    this.bounds = bounds;
    this.ticker = Ticker.shared;
    this.collisionTest = new CollisionTest();
    this.addListeners();
    this.addCanvasMask();
  }

  private addCanvasMask(): void {
    const mask = new Graphics();
    mask.name = "global_stage_mask";
    mask.beginFill();
    mask.drawRect(
      this.bounds.x + Scene.BOUNDING_RECT_PADDING,
      this.bounds.y + Scene.BOUNDING_RECT_PADDING,
      this.bounds.width - Scene.BOUNDING_RECT_PADDING,
      this.bounds.height - Scene.BOUNDING_RECT_PADDING
    );
    mask.endFill();
    this.mask = mask;
    this.addChild(mask);
  }

  private addListeners(): void {
    this.ticker.add(this.eachChildIsInBounds, this);
    this.ticker.add(this.forEachChildTestCollision, this);
    this.on('childAdded', this.handleChildAdded, this);
    this.on('childRemoved', this.handleChildRemoved, this);
  }

  private handleChildAdded(child: GameObject): void {
    this.collisionTest.add(child);
  }

  private handleChildRemoved(child: GameObject): void {
    this.collisionTest.remove(child);
  }

  private eachChildIsInBounds(): void {
    const padding = {
      right: 0,
      bottom: 0,
      left: 0,
      top: 0,
    };
    this.children.forEach((child: GameObject) => {
      const isValid = isGameObject(child) && child?.events?.emit
      if (!isValid) return;
      const childBounds = child;
      const isOutOfBounds =
        childBounds.x + padding.left < this.bounds.left
        || childBounds.x + padding.right > this.bounds.right
        || childBounds.y + padding.bottom > this.bounds.bottom
        || childBounds.y + padding.top < this.bounds.top;
      if (isOutOfBounds) child.events.emit('outOfWorldBounds', this.bounds);
    });
  }

  private forEachChildTestCollision() {
    const collsn = this.collisionTest.collisions();
    collsn.forEach(([objA, objB]) => {
      if (isKinematicBody(objA) && isKinematicBody(objB)) {
        objA.events.emit('onCollide', objB as Container & KinematicBody);
      }
    });
  }

  public destroy(options?: boolean | IDestroyOptions | undefined): void {
    this.ticker.remove(this.eachChildIsInBounds, this);
    this.ticker.remove(this.forEachChildTestCollision, this);
    super.destroy(options);
  }
}
