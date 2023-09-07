
export default class Timer {

  private timeoutId: number | null;

  constructor() {
    this.timeoutId = null;
  }

  public countdown (callback: (() => void), ms: number) {
    this.timeoutId = window.setTimeout(callback, ms);
  }

  public tick (callback: ((status: 'running' | 'complete') => void), tick: number, total: number) {
    let intervalId = window.setInterval(() => callback('running'), tick);
    this.countdown(() => {
      if (intervalId) {
        callback('complete');
        window.clearInterval(intervalId);
      }
    }, total);
  }

  public stop () {
    if (this.timeoutId) {
      window.clearInterval(this.timeoutId);
    }
  }
}
