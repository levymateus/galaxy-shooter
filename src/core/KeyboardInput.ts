type KeyStatus = { keydown?: boolean, keyup?: boolean }

export class KeyboardInput {
  private keyStatus: Record<string, KeyStatus>

  constructor() {
    this.keyStatus = {}
  }

  scan() {
    const status = this.keyStatus
    function assert(key: string) {
      if (!status[key]) {
        status[key] = { keydown: false }
      }
    }
    function handleKeydown(evt: KeyboardEvent) {
      assert(evt.key)
      status[evt.key] = { keydown: true, keyup: false }
    }
    function handleKeyUp(evt: KeyboardEvent) {
      assert(evt.key)
      status[evt.key] = { keydown: false, keyup: true }
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
}
