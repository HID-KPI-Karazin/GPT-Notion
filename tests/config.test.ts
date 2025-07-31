import {
  OPENAI_API_KEY,
  NOTION_API_KEY,
  NOTION_DATABASE_ID,
  OTEL_EXPORTER
} from '../src/config';

test('env variables load with defaults', () => {
  expect(OPENAI_API_KEY).toBe('');
  expect(NOTION_API_KEY).toBe('');
  expect(NOTION_DATABASE_ID).toBe('');
  expect(OTEL_EXPORTER).toBe('stdout');
});
