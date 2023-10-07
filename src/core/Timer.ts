enum TimerStatus {
  IDLE = 0,
  RUNNING,
  COMPLETE,
};

type TimeHandler = (() => void);

export class Timer {
  private status: TimerStatus;
  private id: null | number;

  constructor() {
    this.id = null;
    this.status = TimerStatus.IDLE;
  }

  timeout(callback: TimeHandler, ms: number): void {
    this.stop();
    this.status = TimerStatus.RUNNING;
    this.id = window.setTimeout(() => {
      this.status = TimerStatus.COMPLETE;
      callback();
    }, ms);
  }

  interval(callback: TimeHandler, ms: number): void {
    this.stop();
    this.status = TimerStatus.RUNNING;
    this.id = window.setInterval(callback, ms);
  }

  running(): boolean {
    return this.status === TimerStatus.RUNNING;
  }

  complete(): boolean {
    return this.status === TimerStatus.COMPLETE;
  }

  tick(callback: TimeHandler, tick: number, total: number): Timer {
    this.stop();
    const interval = new Timer();
    interval.interval(() => callback(), tick);
    this.timeout(() => {
      this.status = TimerStatus.COMPLETE;
      callback();
      interval.clear();
    }, total);
    return this;
  }

  clear(): void {
    if (this.id) {
      window.clearInterval(this.id);
      window.clearTimeout(this.id);
    }
  }

  stop(): void {
    this.clear();
  }

}
