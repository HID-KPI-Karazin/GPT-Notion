import { RateLimiter, retryOn429 } from '../src/rateLimiter';

describe('RateLimiter', () => {
  test('limits execution rate', async () => {
    const limiter = new RateLimiter(2, 100); // 2 per 100ms
    const start = Date.now();
    await Promise.all([
      limiter.schedule(async () => 1),
      limiter.schedule(async () => 2),
      limiter.schedule(async () => 3)
    ]);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // third call delayed
    limiter.stop();
  });
});

describe('retryOn429', () => {
  test('retries on 429 with backoff', async () => {
    let attempts = 0;
    const result = await retryOn429(
      async () => {
        attempts++;
        if (attempts < 3) {
          const error: any = new Error('rate limited');
          error.status = 429;
          throw error;
        }
        return 'ok';
      },
      3,
      10
    );
    expect(result).toBe('ok');
    expect(attempts).toBe(3);
  });
});
