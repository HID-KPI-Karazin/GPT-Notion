import { InMemoryRagStore } from '../src/ragStore';

test('upsert and query returns closest items', async () => {
  const store = new InMemoryRagStore();
  await store.upsert('1', [1, 0], { title: 'a' });
  await store.upsert('2', [0, 1], { title: 'b' });
  const results = await store.query([1, 0], 1);
  expect(results.length).toBe(1);
  expect(results[0].id).toBe('1');
});
