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

const MAX_BLOCKS = 1000;
const MAX_SIZE = 500 * 1024; // bytes

export class NotionConnector {
  private notion: Client;
  private queue: PQueue;
  private limiter: RateLimiter;

  constructor(apiKey: string, client?: Client) {
    this.notion = client ?? new Client({ auth: apiKey });
    this.queue = new PQueue({ interval: 1000, intervalCap: 3 });
    this.limiter = new RateLimiter(3, 1000);
  }

  private async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return retryOn429(() => this.limiter.schedule(() => this.queue.add(fn)));
  }

  async listChildrenPaged(
    blockId: string,
    startCursor?: string
  ): Promise<CursorResult<any>> {
    return this.enqueue(() =>
      this.notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: startCursor
      })
    );
  }

  async collectAllChildren(blockId: string): Promise<CursorResult<any>> {
    const results = await collectPaginated((cursor) =>
      this.listChildrenPaged(blockId, cursor)
    );
    return { object: 'list', results } as unknown as CursorResult<any>;
  }

  async appendChildrenChecked(blockId: string, children: any[]): Promise<void> {
    if (children.length > MAX_BLOCKS) {
      throw new Error('Cannot write more than 1000 blocks at once');
    }
    const size = Buffer.byteLength(JSON.stringify(children), 'utf8');
    if (size > MAX_SIZE) {
      throw new Error('Payload exceeds 500KB');
    }
    await this.enqueue(() =>
      this.notion.blocks.children.append({ block_id: blockId, children })
    );
  }
}
