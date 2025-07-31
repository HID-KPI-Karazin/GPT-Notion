import { InMemoryRagStore } from '../src/ragStore';

const store = new InMemoryRagStore();

beforeEach(async () => {
  await store.upsert('a', [0, 0], { text: 'first' });
  await store.upsert('b', [1, 1], { text: 'second' });
  await store.upsert('c', [5, 5], { text: 'third' });
});

test('query returns nearest results', async () => {
  const results = await store.query([0.1, -0.1], 2);
  expect(results[0].id).toBe('a');
  expect(results[1].id).toBe('b');
});
