export class RateLimiter {
  private tokens: number;
  private readonly interval: NodeJS.Timeout;
  private queue: Array<() => void> = [];

  constructor(
    private requestsPerMinute: number,
    private windowMs = 60000
  ) {
    this.tokens = requestsPerMinute;
    const refillMs = windowMs / requestsPerMinute;
    this.interval = setInterval(() => this.refill(), refillMs);
  }

  private refill(): void {
    if (this.tokens < this.requestsPerMinute) {
      this.tokens++;
    }
    while (this.tokens > 0 && this.queue.length) {
      this.tokens--;
      const job = this.queue.shift();
      job?.();
    }
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    if (this.tokens > 0) {
      this.tokens--;
      return fn();
    }
    return new Promise<T>((resolve, reject) => {
      this.queue.push(() => {
        fn().then(resolve).catch(reject);
      });
    });
  }

  stop(): void {
    clearInterval(this.interval);
  }
}

export async function retryOn429<T>(
  fn: () => Promise<T>,
  retries = 5,
  initialDelayMs = 3000
): Promise<T> {
  let delay = initialDelayMs;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err?.status === 429 && attempt < retries) {
        const headerDelay = Number(
          err?.headers?.['retry-after'] ??
            err?.response?.headers?.['retry-after']
        );
        const wait = !Number.isNaN(headerDelay) ? headerDelay * 1000 : delay;
        await new Promise((r) => setTimeout(r, wait));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
  throw new Error('retryOn429 exhausted retries');
}
