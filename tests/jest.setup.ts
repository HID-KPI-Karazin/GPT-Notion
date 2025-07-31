jest.mock('@notionhq/client', () => {
  class Client {
    databases = { query: jest.fn(async () => ({ results: [], has_more: false })) };
    blocks = { children: { append: jest.fn(async () => ({})) } };
  }
  return { Client };
}, { virtual: true });

jest.mock('p-queue', () => {
  return class PQueue {
    add(fn: () => any) {
      return Promise.resolve().then(fn);
    }
  };
}, { virtual: true });
