import { NotionConnector, collectPaginated } from '../src/notionConnector';
import { RateLimiter } from '../src/rateLimiter';

jest.mock('@notionhq/client', () => {
  class Client {
    databases = { query: jest.fn(async () => ({ results: [], has_more: false })) };
    blocks = { children: { append: jest.fn(async () => ({})) } };
  }
  return { Client };
});

jest.mock('p-queue', () => {
  return class PQueue {
    add(fn: () => any) {
      return Promise.resolve().then(fn);
    }
  };
});

class FakeNotion {
  blocks = { children: { append: jest.fn().mockResolvedValue({}) } };
  databases = { query: jest.fn() };
}

test('collectPaginated aggregates pages', async () => {
  let call = 0;
  const fetch = async (cursor?: string) => {
    const pages = [ [1, 2], [3] ];
    const index = call++;
    return {
      results: pages[index] || [],
      has_more: index < pages.length - 1,
      next_cursor: index < pages.length - 1 ? `c${index}` : null
    };
  };
  const result = await collectPaginated(fetch);
  expect(result).toEqual([1, 2, 3]);
});

test('appendBlocks enforces limits and chunks', async () => {
  const fake = new FakeNotion();
  const limiter = new RateLimiter(1000, 1000);
  const connector = new NotionConnector('secret', limiter, fake as any);
  const blocks = Array.from({ length: 150 }, () => ({
    type: 'paragraph',
    paragraph: { rich_text: [] }
  }));
  await connector.appendBlocks('p1', blocks);
  expect(fake.blocks.children.append).toHaveBeenCalledTimes(2);
  expect(fake.blocks.children.append.mock.calls[0][0].children.length).toBe(100);
  expect(fake.blocks.children.append.mock.calls[1][0].children.length).toBe(50);
  limiter.stop();
});

test('appendBlocks throws on oversized payload', async () => {
  const fake = new FakeNotion();
  const limiter = new RateLimiter(1000, 1000);
  const connector = new NotionConnector('secret', limiter, fake as any);
  const large = Array.from({ length: 1001 }, () => ({
    type: 'paragraph',
    paragraph: { rich_text: [] }
  }));
  await expect(connector.appendBlocks('p1', large)).rejects.toThrow(
    'Payload exceeds Notion limits'
  );
  limiter.stop();
});
