import { Circle, Container, Point, ResolverManifest } from "pixi.js";
import { AxisAlignedBounds } from "core/AxisAlignedBounds";
import { EventEmitter } from "core/EventEmitter";
import { Wrapper } from "core/Wrapper";

// types
export type GameOptions = {
  manifest?: string | ResolverManifest;
}

export type Resolution = { w: number, h: number, ratio: [number, number] };

export type GameObjectEventEmmiter = EventEmitter<GameObjectEvents>;

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

// enums
export enum Actions {
  MOVE_UP = "MOVE_UP",
  MOVE_DOWN = "MOVE_DOWN",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  WEAPON_FIRE = "WEAPON_FIRE",
};

// interfaces
export interface ISceneGraph {
  onStart(root: Wrapper): Promise<void>;
  onUpdate(delta: number): void;
  onFinish(): Promise<void>;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  name: string;
  rotate: number;
  events: GameObjectEventEmmiter;
  destroy(): void;
}

export interface KinematicBody extends GameObject {
  speed: Point;
  collisionShape: Circle;
  clone(): GameObject;
}

export interface Drawable {
  color: number;
  alpha: number;
  draw(): void;
}

export interface Item {
  equip(): void;
  unequip(): void;
}

export interface Weapon extends Item {
  fire(): boolean;
}

export interface Projectile extends GameObject {
  shoot(): void;
  clone(): Projectile;
}

export interface GameObjectEvents {
  collide: [container: Container & KinematicBody];
  onCollide: [container: Container & KinematicBody];
  outOfWorldBounds: [bounds: AxisAlignedBounds];
}

export interface InputEvents {
  onActionPressed: [action: Actions];
  onActionReleased: [action: Actions];
}

// functions
export function isGameObject(object: unknown): object is GameObject {
  const asGameObject = (object as GameObject);
  return !!asGameObject?.id !== undefined
    && !!asGameObject?.name !== undefined
    && !!asGameObject?.events !== undefined;
}

export function isKinematicBody(object: unknown): object is KinematicBody {
  const asKinematic = (object as KinematicBody);
  return !!(asKinematic?.collisionShape || asKinematic?.events);
}


