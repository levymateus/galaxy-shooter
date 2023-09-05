
type KeyStatus = { keydown?: boolean }

class Keyboard {

  private keyStatus: Record<string, KeyStatus>;

  constructor() {
    this.keyStatus = {};
  }

  public scan() {

    let status = this.keyStatus;

    function assert(key: string) {
      if (!status[key]) {
        status[key] = { keydown: false };
      }
    }

    function handleKeydown(evt: KeyboardEvent) {
      assert(evt.key);
      status[evt.key] = { keydown: true };
    }

    function handleKeyUp(evt: KeyboardEvent) {
      assert(evt.key);
      (status[evt.key] as KeyStatus).keydown = false;
    }

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyUp);

    return this;
  }

  public isKeyDown(key: string) {
    return this.keyStatus[key]?.keydown;
  }

}

export default new Keyboard().scan();
