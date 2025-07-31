import { initOTEL } from '../src/otel';

test('initOTEL initializes stdout exporter by default', () => {
  delete process.env.OTEL_EXPORTER;
  expect(() => initOTEL()).not.toThrow();
});

test('initOTEL initializes prometheus exporter when configured', () => {
  process.env.OTEL_EXPORTER = 'prometheus';
  process.env.NODE_ENV = 'test';
  expect(() => initOTEL()).not.toThrow();
});
