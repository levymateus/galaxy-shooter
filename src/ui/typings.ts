import { DisplayObject, utils } from "pixi.js";
import GUI from "ui/GUI";

export enum Components {
  HUD = "HUD"
}

export interface Activity<E extends utils.EventEmitter.ValidEventTypes> extends DisplayObject {
  name: string;
  onStart(gui: GUI<E>): Promise<void>;
  onUpdate(delta: number): void;
  onFinish(): Promise<void>;
}
