import { Client } from '@notionhq/client';
import PQueue from 'p-queue';
import { RateLimiter, retryOn429 } from './rateLimiter';

export interface CursorResult<T> {
  results: T[];
  next_cursor?: string | null;
  has_more: boolean;
}

export async function collectPaginated<T>(
  // eslint-disable-next-line no-unused-vars
  fetch: (cursor?: string) => Promise<CursorResult<T>>
): Promise<T[]> {
  const all: T[] = [];
  let cursor: string | undefined;
  do {
    const res = await fetch(cursor);
    all.push(...res.results);
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return all;
}

export class NotionConnector {
  private client: Client;
  private queue: PQueue;
  private limiter: RateLimiter;

  constructor(
    apiKey: string,
    limiter: RateLimiter = new RateLimiter(3, 1000),
    client?: Client
  ) {
    this.client = client ?? new Client({ auth: apiKey });
    this.limiter = limiter;
    this.queue = new PQueue({ interval: 1000, intervalCap: 3 });
  }

  async queryDatabaseAll(databaseId: string): Promise<any[]> {
    return collectPaginated((c?: string) =>
      this.enqueue(() =>
        this.client.databases.query({
          database_id: databaseId,
          start_cursor: c,
          page_size: 100
        })
      )
    );
  }

  async appendBlocks(pageId: string, blocks: any[]): Promise<void> {
    const size = Buffer.byteLength(JSON.stringify(blocks));
    if (blocks.length > 1000 || size > 500 * 1024) {
      throw new Error('Payload exceeds Notion limits');
    }
    for (let i = 0; i < blocks.length; i += 100) {
      const chunk = blocks.slice(i, i + 100);
      await this.enqueue(() =>
        this.client.blocks.children.append({
          block_id: pageId,
          children: chunk
        })
      );
    }
  }

  private async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return retryOn429(() => this.limiter.schedule(() => this.queue.add(fn)));
  }
}
