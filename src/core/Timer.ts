
export default class Timer {


  public static countdown (callback: (() => void), ms: number) {
    window.setTimeout(callback, ms);
  }

  public static tick (callback: ((status: 'running' | 'complete') => void), tick: number, total: number) {
    let intervalId = window.setInterval(() => callback('running'), tick);
    Timer.countdown(() => {
      if (intervalId) {
        callback('complete');
        window.clearInterval(intervalId);
      }
    }, total);
  }

}
