import { InMemoryRagStore } from '../src/ragStore';

test('upsert and query', async () => {
  const store = new InMemoryRagStore();
  await store.upsert('a', [1, 0], { title: 'a' });
  await store.upsert('b', [0, 1], { title: 'b' });
  const results = await store.query([1, 0], 1);
  expect(results[0].id).toBe('a');
  expect(results[0].metadata.title).toBe('a');
});
