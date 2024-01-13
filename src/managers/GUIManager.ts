import {
  ActivityElement,
  AxisAlignedBounds,
  Context,
  EventEmitter,
  Manager,
  Surface
} from "core";
import { Container, HTMLText, Rectangle, Ticker } from "pixi.js";
import { AppEvents } from "typings";
import { GUITextFactory, TextFactory } from "ui/Text";

export class GUIElement
  extends Container
    implements ActivityElement<AppEvents>
{
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
  textFactory: GUITextFactory<HTMLText>
  manager: GUIManager

  constructor(
    ticker: Ticker,
    stage: Container,
    screen: Rectangle,
    surface: Surface,
    bounds: AxisAlignedBounds,
    emitter: EventEmitter<AppEvents>,
    index?: number,
  ) {
    super(ticker, stage, screen, surface, bounds, emitter, index)
    this.textFactory = new TextFactory()
  }
}
