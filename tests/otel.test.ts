import { initOTEL } from '../src/otel';

test('initOTEL initializes exporter', () => {
  expect(() => initOTEL()).not.toThrow();
});
