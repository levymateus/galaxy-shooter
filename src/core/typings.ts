import { Sprite as PixiJSSprite, AnimatedSprite as PixiJSAnimatedSprite } from "pixi.js";

import { GameObject } from "./GameObject";

export type Node = PixiJSSprite | PixiJSAnimatedSprite;

export type StartCallback = (go: GameObject) => void;

export type UpdateCallback = (delta: number) => void;

export type DestroyCallback = () => void;

export function isAnimatedSprite(node: Node): node is PixiJSAnimatedSprite {
  return node instanceof PixiJSAnimatedSprite
}

export type Sprite = PixiJSSprite;

export type AnimatedSprite = PixiJSAnimatedSprite;
