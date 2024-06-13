import { Actions } from "core"
import { KeyboardInput } from "core/KeyboardInput"
import { Ticker, utils } from "pixi.js"

import settings from "res/settings.json"

/**
 * The `GameInputHandler` singleton class,
 * is a global game input handling for any type of input,
 * like keyboard, gamepad etc.
 */
class GameInputHandler extends utils.EventEmitter {
  /**
   * `true` when any action is pressed otherwise `false`.
   */
  pressed: boolean

  private static instance: GameInputHandler
  private keyboardInput: KeyboardInput
  private ticker: Ticker

  constructor() {
    super()

    this.keyboardInput = new KeyboardInput()
    this.keyboardInput.scan()

    this.ticker = Ticker.shared
    this.ticker.add(() => {
      for (const act in Actions) {
        this.isActionPressed(act as Actions)
        this.isActionReleased(act as Actions)
      }
    })
    this.ticker.start()
  }

  static getInstance(): GameInputHandler {
    if (!GameInputHandler.instance) {
      GameInputHandler.instance = new GameInputHandler()
    }
    return GameInputHandler.instance
  }

  /**
   * Check if the `assets/res/settings.json` Keyboard configured named actions
   * is pressed or not.
   *
   * @param action The previus configured action name string
   * @returns `true` if is pressed or `false`.
   */
  isActionPressed(action: Actions): boolean {
    const key = settings?.Keyboard[action]
    const isKeyDown = this.keyboardInput.isKeyDown(key)
    if (isKeyDown) {
      this.pressed = true
      this.emit('onActionPressed', action)
    }
    return isKeyDown
  }

  /**
  * Check if the `assets/res/settings.json`
  * Keyboard configured named actions is released.
  *
  * @param action The previus configured action name string
  * @returns `true` if is released or `false`.
  */
  isActionReleased(action: Actions): boolean {
    const key = settings?.Keyboard[action]
    const isKeyUp = this.keyboardInput.isKeyUp(key)
    if (isKeyUp) {
      this.pressed = false
      this.emit('onActionReleased', action)
    }
    return isKeyUp
  }
}

const Input = GameInputHandler.getInstance()
export { Input }
