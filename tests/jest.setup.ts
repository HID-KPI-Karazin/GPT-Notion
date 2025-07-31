jest.mock(
  '@notionhq/client',
  () => {
    class Client {
      databases = {
        query: jest.fn(async () => ({ results: [], has_more: false }))
      };
      blocks = { children: { append: jest.fn(async () => ({})) } };
    }
    const collectPaginatedAPI = jest.fn(async (fn, { start_cursor }) => {
      const results: any[] = [];
      let cursor = start_cursor;
      while (true) {
        const page = await fn({ start_cursor: cursor });
        results.push(...page.results);
        if (!page.has_more) break;
        cursor = page.next_cursor;
      }
      return results;
    });
    return { Client, collectPaginatedAPI };
  },
  { virtual: true }
);

jest.mock(
  'p-queue',
  () => {
    return class PQueue {
      add(fn: () => any) {
        return Promise.resolve().then(fn);
      }
    };
  },
  { virtual: true }
);
