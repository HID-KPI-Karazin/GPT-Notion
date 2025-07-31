import { NotionConnector } from '../src/notionConnector';

type ListResponse = {
  results: any[];
  has_more: boolean;
  next_cursor?: string | null;
};

class FakeClient {
  public blocks = {
    children: {
      list: jest.fn<Promise<ListResponse>, [any]>(),
      append: jest.fn<Promise<void>, [any]>()
    }
  };
}

test('listBlocks paginates until no more results', async () => {
  const client = new FakeClient();
  client.blocks.children.list
    .mockResolvedValueOnce({
      results: [{ id: 'a' }],
      has_more: true,
      next_cursor: 'b'
    })
    .mockResolvedValueOnce({
      results: [{ id: 'b' }],
      has_more: false
    });
  const connector = new NotionConnector('secret', client as any);
  const blocks = await connector.listBlocks('123');
  expect(blocks).toEqual([{ id: 'a' }, { id: 'b' }]);
});

test('appendBlocks validates payload size', async () => {
  const client = new FakeClient();
  const connector = new NotionConnector('secret', client as any);
  const big = Array(1001).fill({ type: 'p' });
  await expect(connector.appendBlocks('id', big)).rejects.toThrow(
    'payload too large'
  );
});
