import { AxisAlignedBounds, KinematicBody, isGameObject, isKinematicBody } from "core";
import { Container, IDestroyOptions, Ticker } from 'pixi.js';
import CollisionTest from 'core/CollisionTest';
import GameObject from 'core/GameObject';

/**
 * Wrapper class is the main container of the current scene.
 * Controls the bounds, notify the direct children.
 */
export class Wrapper extends Container {

  public bounds: AxisAlignedBounds;

  private ticker: Ticker;
  private collisionTest: CollisionTest;

  constructor(width: number, height: number) {
    super();
    this.bounds = new AxisAlignedBounds(0, 0, width, height);
    this.bounds.anchor.set(0.5);
    this.ticker = Ticker.shared;
    this.collisionTest = new CollisionTest();
    this.addListeners();
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
      if (isGameObject(child)) {
        const childBounds = child;
        const isOutOfBounds =
          childBounds.x + padding.left < this.bounds.left
          || childBounds.x + padding.right > this.bounds.right
          || childBounds.y + padding.bottom > this.bounds.bottom
          || childBounds.y + padding.top < this.bounds.top;
        if (isOutOfBounds) {
          child.events.emit('outOfWorldBounds', this.bounds);
        }
      }
    });
  }

  private forEachChildTestCollision() {
    const collsn = this.collisionTest.collisions();
    collsn.forEach(([a, b]) => {
      if (isKinematicBody(a) && isKinematicBody(b)) {
        a.events.emit('onCollide', b as Container & KinematicBody);
      }
    });
  }

  public destroy(options?: boolean | IDestroyOptions | undefined): void {
    this.ticker.remove(this.eachChildIsInBounds, this);
    this.ticker.remove(this.forEachChildTestCollision, this);
    super.destroy(options);
  }
}
