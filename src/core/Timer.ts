enum TimerStatus {
  IDLE = 0,
  RUNNING,
  COMPLETE,
}

type TimeHandler = (() => void)

/**
 * The `Timer` class manage the window timer handling.
 */
export class Timer {
  private status: TimerStatus
  private id: null | number

  constructor() {
    this.id = null
    this.status = TimerStatus.IDLE
  }

  async wait(ms: number = 1000): Promise<void> {
    return await this.timeout(ms)
  }

  async timeout(ms: number = 1000, callback?: TimeHandler): Promise<void> {
    return new Promise<void>((resolve) => {
      this.stop()
      this.status = TimerStatus.RUNNING
      this.id = window.setTimeout(() => {
        this.status = TimerStatus.COMPLETE
        callback && callback()
        resolve()
      }, ms)
    })
  }

  async interval(ms: number = 1000, callback?: TimeHandler): Promise<void> {
    return new Promise<void>((resolve) => {
      this.stop()
      this.status = TimerStatus.RUNNING
      this.id = window.setInterval(() => {
        callback && callback()
        resolve()
      }, ms)
    })
  }

  running(): boolean {
    return this.status === TimerStatus.RUNNING
  }

  complete(): boolean {
    return this.status === TimerStatus.COMPLETE
  }

  tick(callback: TimeHandler, tick: number, total: number): Timer {
    this.stop()
    const interval = new Timer()
    interval.interval(tick, callback)
    this.timeout(total, () => {
      this.status = TimerStatus.COMPLETE
      callback()
      interval.clear()
    })
    return this
  }

  debounce(callback: TimeHandler, ms: number = 300) {
    return this.timeout(ms, callback)
  }

  clear(): void {
    if (this.id) {
      window.clearInterval(this.id)
      window.clearTimeout(this.id)
    }
  }

  stop(): void {
    this.clear()
  }
}
