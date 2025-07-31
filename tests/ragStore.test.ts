import {
  InMemoryRagStore,
  ChromaRagStore,
  PineconeRagStore
} from '../src/ragStore';

test('upsert and query returns closest items', async () => {
  const store = new InMemoryRagStore();
  await store.upsert('1', [1, 0], { title: 'a' });
  await store.upsert('2', [0, 1], { title: 'b' });
  const results = await store.query([1, 0], 1);
  expect(results.length).toBe(1);
  expect(results[0].id).toBe('1');
});

test('ChromaRagStore delegates to client', async () => {
  const fakeCol = {
    upsert: jest.fn(async () => {}),
    query: jest.fn(async () => ({ ids: [['1']], metadatas: [[{ t: 1 }]] }))
  };
  const fakeClient = {
    getOrCreateCollection: jest.fn(async () => fakeCol)
  };
  const store = new ChromaRagStore('url', 'col', fakeClient as any);
  await store.upsert('1', [0], { t: 1 });
  const res = await store.query([0], 1);
  expect(fakeCol.upsert).toBeCalled();
  expect(res[0].id).toBe('1');
});

test('PineconeRagStore delegates to client', async () => {
  const fakeIndex = {
    upsert: jest.fn(async () => {}),
    query: jest.fn(async () => ({ matches: [{ id: '1', metadata: { t: 1 } }] }))
  };
  const fakePc = { index: jest.fn(() => fakeIndex) };
  const store = new PineconeRagStore('k', 'env', 'idx', fakePc as any);
  await store.upsert('1', [0], { t: 1 });
  const res = await store.query([0], 1);
  expect(fakeIndex.upsert).toBeCalled();
  expect(res[0].id).toBe('1');
});
