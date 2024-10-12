import {
  ActivityCtor,
  ActivityElement,
  Context,
  Core,
  Manager,
  Surface
} from "core"
import { Container, HTMLText, Rectangle, Ticker, utils } from "pixi.js"
import { GUITextFactory, TextFactory } from "ui/Text"

export class GUIElement
  extends Container
  implements ActivityElement {
  constructor() {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(_context: Context): Promise<void> {
    throw new Error("Method not implemented.")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate(_delta: number): void {
    throw new Error("Method not implemented.")
  }

  onFinish(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

/**
 * Game Graphic User Interface Manager.
 */
export class GUIManager extends Manager {
  textFactory: GUITextFactory<HTMLText>
  manager: GUIManager

  constructor(
    public readonly ticker: Ticker,
    public readonly stage: Container,
    public readonly screen: Rectangle,
    public readonly surface: Surface,
    public readonly bounds: Core.AxisAlignedBounds,
    public readonly emitter: utils.EventEmitter,
  ) {
    super(ticker, stage, screen, surface, bounds, emitter)
    this.textFactory = new TextFactory()
  }

  async goto(
    ctor: ActivityCtor,
    options?: { gotoAndStart?: boolean }
  ): Promise<void> {
    await super.goto(ctor, options)
  }
}
