import {
  ActivityElement,
  Context,
  Manager
} from "core";
import { Container } from "pixi.js";
import { AppEvents } from "typings";

export class GUIElement extends Container implements ActivityElement<AppEvents> {
  constructor() {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(_context: Context<AppEvents>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate(_delta: number): void {
    throw new Error("Method not implemented.");
  }

  onFinish(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

/**
 * Game Graphic User Interface Manager.
 */
export class GUIManager extends Manager<AppEvents> {
  /**
   * Add an activity without destroy the previous activity.
   * @param ctor The activity constructor.
   */
  // async render(ctor: ActivityElementCtor<AppEvents>) {
  //   if (this.context) {
  //     // Create a sub context
  //     this.context.create(ctor)
  //   }
  // }
}
