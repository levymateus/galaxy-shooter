import { Timer } from "./Timer";

export class Countdown {
  private timer = new Timer()

  private _ready = true

  async count(ms: number) {
    if (this._ready) {
      this._ready = false
      return new Promise((resolve) => {
        this.timer.debounce(() => {
          this._ready = true
          resolve(true)
        }, ms)
      })
    }
    return false
  }

  get ready() {
    return this._ready
  }
}
