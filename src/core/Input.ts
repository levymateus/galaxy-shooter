import { KeyboardInput } from "core/KeyboardInput";
import { MouseInput } from "core/MouseInput";
import { EventEmitter } from "core/EventEmitter";
import { Actions, InputEvents } from "core/typings";
import { Ticker } from "pixi.js";
import settings from "res/settings.json";

/**
 * Global game input handling for any type of input (keyboard, controler).
 */
class GameInputHandler extends EventEmitter<InputEvents> {

  private static instance: GameInputHandler;
  private keyboardInput: KeyboardInput;
  private mouseInput: MouseInput;
  private ticker: Ticker;

  constructor() {
    super();

    this.keyboardInput = new KeyboardInput();
    this.keyboardInput.scan();

    this.mouseInput = new MouseInput();
    this.mouseInput.scan();

    this.ticker = new Ticker();
    this.ticker.add(() => {
      for (let act in Actions) {
        this.isActionPressed(act as Actions);
        this.isActionReleased(act as Actions);
      }
    });
    this.ticker.start();
  }

  public static getInstance(): GameInputHandler {
    if (!GameInputHandler.instance) {
      GameInputHandler.instance = new GameInputHandler();
    }
    return GameInputHandler.instance;
  }

  /**
   * Check if the `assets/res/settings.json` Keyboard configured named actions is pressed or not.
   * @param action The previus configured action name string
   * @returns `true` if is pressed or `false`.
   */
  public isActionPressed(action: Actions): boolean {
    const key = settings?.Keyboard[action];
    const isKeyDown = this.keyboardInput.isKeyDown(key);

    const button = settings?.Mouse[action];
    const isMouseDown = button !== null && this.mouseInput.isKeyDown(button);

    if (isKeyDown || isMouseDown) {
      this.emit('onActionPressed', action);
    }

    return isKeyDown;
  }

  /**
  * Check if the `assets/res/settings.json` Keyboard configured named actions is released.
  * @param action The previus configured action name string
  * @returns `true` if is released or `false`.
  */
  public isActionReleased(action: Actions): boolean {
    const key = settings?.Keyboard[action];
    const isKeyUp = this.keyboardInput.isKeyUp(key);

    const button = settings?.Mouse[action];
    const isMouseUp = button !== null && this.mouseInput.isKeyUp(button);

    if (isKeyUp || isMouseUp) {
      this.emit('onActionReleased', action);
    }

    return isKeyUp;
  }
}

const Input = GameInputHandler.getInstance();
export { Input };
