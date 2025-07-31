import { Scheduler } from '../src/scheduler';

jest.useFakeTimers();

test('scheduler runs job on interval', () => {
  const scheduler = new Scheduler(50);
  const job = jest.fn();
  scheduler.add(job);
  scheduler.start();
  jest.advanceTimersByTime(160);
  scheduler.stop();
  expect(job).toHaveBeenCalledTimes(3);
});
