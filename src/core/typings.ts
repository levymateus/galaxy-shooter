import { Circle, Container, Point, ResolverManifest } from "pixi.js";
import EventEmitter from "./EventEmitter";

export type GameOptions = {
  manifest?: string | ResolverManifest;
}

export type Resolution = { w: number, h: number, ratio: [number, number] };

export enum Actions {
  MOVE_UP = "MOVE_UP",
  MOVE_DOWN = "MOVE_DOWN",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  WEAPON_FIRE = "WEAPON_FIRE",
};

export interface Weapon {
  fire(): boolean;
}

export interface Projectile extends GameObject {
  shoot(): void;
  clone(): Projectile;
  destroy(): void;
}

export type GameSettings = {
  Keyboard: {
    MoveUp: string
    MoveDown: string
    MoveLeft: string
    MoveRight: string
    WeaponFire: string
  },
  Mouse: {
    WeaponFire: string
  }
}

export interface HitTestEvents {
  hit: [container: Container & KinematicBody];
  onHit: [container: Container & KinematicBody];
}

export interface InputEvents {
  onActionPressed: [action: Actions];
  onActionReleased: [action: Actions];
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  name: string;
  rotate: number;
}

export interface Drawable {
  color: number;
  alpha: number;
  draw(): void;
}

export interface KinematicBody extends GameObject {
  speed: Point;
  collisionShape: Circle;
  events: EventEmitter<HitTestEvents>;
}

export function isKinematicBody(object: unknown): object is KinematicBody {
  const asKinematic = (object as KinematicBody);
  return !!(asKinematic?.collisionShape || asKinematic?.events);
}

export function isGameObject(object: unknown): object is GameObject {
  const asGameObject = (object as GameObject);
  return !!asGameObject.rotate !== undefined || asGameObject.x !== undefined || asGameObject.y !== undefined;
}

export interface ISceneGraph {
  onStart(root: Container): Promise<void>;
  onUpdate(delta: number): void;
  onFinish(): Promise<void>;
}
