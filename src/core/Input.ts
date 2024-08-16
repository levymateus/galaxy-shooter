import { AbstractKeyboardInput } from "core/KeyboardInput"
import { Input } from "./typings"

/**
 * The `GameInputHandler` singleton class,
 * is a global game input handling for any type of input,
 * like keyboard, gamepad etc.
 */
class AbstractInputSingleton implements Input {
  /**
   * `true` when any action is pressed otherwise `false`.
   */
  pressed: boolean

  private static instance: AbstractInputSingleton

  constructor(
    public readonly keyboardInput: AbstractKeyboardInput,
  ) {
    this.keyboardInput.scan()
  }

  static getInstance(): AbstractInputSingleton {
    if (!AbstractInputSingleton.instance) {
      AbstractInputSingleton.instance = new AbstractInputSingleton(
        new AbstractKeyboardInput(),
      )
    }
    return AbstractInputSingleton.instance
  }

  isKeyPressed(...keys: string[]): boolean {
    const isKeyPressed = keys.some(
      (key) => this.keyboardInput.isKeyPressed(key)
    )
    this.pressed = isKeyPressed
    return isKeyPressed
  }

  isKeyReleased(...keys: string[]): boolean {
    const isKeyReleased = keys.some(
      (key) => this.keyboardInput.isKeyReleased(key),
    )
    return isKeyReleased
  }

  isKeyDown(key: string): boolean {
    return this.keyboardInput.isKeyDown(key)
  }

  isKeyUp(key: string): boolean {
    return this.keyboardInput.isKeyUp(key)
  }
}

export const InputSingleton = AbstractInputSingleton.getInstance()

export default InputSingleton
