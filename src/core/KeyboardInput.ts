import { Input } from "./typings"

type KeyStatus = { keydown?: boolean, keyup?: boolean, pressed?: boolean }

/**
 * The singleton `KeyboardInput` class manage the keyboard handling.
 */
export class AbstractKeyboardInput implements Input {
  private keyStatus: Record<string, KeyStatus> = {}

  scan() {
    const status = this.keyStatus

    const assert = (key: string) => {
      if (!status[key]) {
        status[key] = { keydown: false, keyup: false, pressed: false }
      }
    }

    const handleKeydown = (evt: KeyboardEvent) => {
      assert(evt.key)
      status[evt.key] = { keydown: true, keyup: false, pressed: true }
    }

    const handleKeyUp = (evt: KeyboardEvent) => {
      assert(evt.key)
      status[evt.key] = { keydown: false, keyup: true, pressed: false }
    }

    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyUp)

    return this
  }

  isKeyDown(key: string): boolean {
    return !!this.keyStatus[key]?.keydown
  }

  isKeyUp(key: string): boolean {
    return !!this.keyStatus[key]?.keyup
  }

  isKeyPressed(key: string): boolean {
    if (this.keyStatus[key]) {
      this.keyStatus[key].keydown = false
    }
    return !!this.keyStatus[key]?.pressed
  }

  isKeyReleased(key: string): boolean {
    if (this.keyStatus[key]) {
      this.keyStatus[key].keyup = false
    }
    return !!this.keyStatus[key]?.pressed
  }
}
