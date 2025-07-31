import { NotionConnector } from '../src/notionConnector';

jest.mock('p-queue', () => ({
  __esModule: true,
  default: class {
    constructor() {}
    add<T>(fn: () => Promise<T> | T): Promise<T> {
      return Promise.resolve().then(fn);
    }
  }
}));

class FakeNotion {
  blocks = {
    children: {
      list: jest.fn(async (opts: any) => {
        if (!opts.start_cursor) {
          return {
            object: 'list',
            results: [{ id: '1' }],
            next_cursor: 'b',
            has_more: true
          };
        }
        return {
          object: 'list',
          results: [{ id: '2' }],
          next_cursor: null,
          has_more: false
        };
      }),
      append: jest.fn(async () => ({}))
    }
  };
}

test('listChildrenPaged returns page', async () => {
  const conn = new NotionConnector('secret', new FakeNotion() as any);
  const page1 = await conn.listChildrenPaged('1');
  expect(page1.results.length).toBe(1);
  const all = await conn.collectAllChildren('1');
  expect(all.results.length).toBe(2);
});

test('appendChildrenChecked enforces limits', async () => {
  const fake = new FakeNotion();
  const conn = new NotionConnector('secret', fake as any);
  await conn.appendChildrenChecked('1', [{ obj: 'block' }]);
  expect(fake.blocks.children.append).toBeCalled();
  await expect(
    conn.appendChildrenChecked('1', new Array(1001).fill({}))
  ).rejects.toThrow('Cannot write more than 1000 blocks');
});
