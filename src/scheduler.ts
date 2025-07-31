export type Job = () => Promise<void> | void;

export class Scheduler {
  private timer?: NodeJS.Timeout;
  private jobs: Job[] = [];
  private intervalMs: number;

  constructor(intervalMs: number) {
    this.intervalMs = intervalMs;
  }

  add(job: Job): void {
    this.jobs.push(job);
  }

  start(): void {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(async () => {
      for (const job of this.jobs) {
        try {
          await job();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Scheduler job failed', err);
        }
      }
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
