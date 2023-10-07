type KeyStatus = { keydown?: boolean, keyup?: boolean };

export class MouseInput {
  private keyStatus: Record<number, KeyStatus>;

  constructor() {
    this.keyStatus = {};
  }

  scan() {
    let status = this.keyStatus;
    function assert(button: number) {
      if (!status[button]) {
        status[button] = { keydown: false, keyup: false };
      }
    }
    function handleMouseDown(evt: MouseEvent) {
      assert(evt.button);
      status[evt.button] = { keydown: true, keyup: false };
    }
    function handleMouseUp(evt: MouseEvent) {
      assert(evt.button);
      status[evt.button] = { keydown: false, keyup: true };
    }
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return this;
  }

  isKeyDown(button: number): boolean {
    return !!this.keyStatus[button]?.keydown;
  }

  isKeyUp(button: number): boolean {
    return !!this.keyStatus[button]?.keyup;
  }
}
