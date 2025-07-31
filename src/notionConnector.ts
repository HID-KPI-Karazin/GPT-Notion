import { Client } from '@notionhq/client';
import PQueue from 'p-queue';

export interface PaginationResult<T> {
  results: T[];
  has_more: boolean;
  next_cursor?: string | null;
}

// eslint-disable-next-line no-unused-vars
export type PageFetcher<T> = (cursor?: string) => Promise<PaginationResult<T>>;

export async function paginate<T>(
  fetchPage: PageFetcher<T>,
  limit = 1000,
  sizeLimit = 500 * 1024
): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | undefined;
  while (true) {
    const page = await fetchPage(cursor);
    items.push(...page.results);
    if (items.length >= limit) {
      return items.slice(0, limit);
    }
    if (Buffer.byteLength(JSON.stringify(items)) >= sizeLimit) {
      return items;
    }
    if (!page.has_more || !page.next_cursor) break;
    cursor = page.next_cursor;
  }
  return items;
}

export class NotionConnector {
  private client: Client;
  private queue: PQueue;

  constructor(auth: string, client?: Client) {
    this.client = client ?? new Client({ auth });
    this.queue = new PQueue({ interval: 1000, intervalCap: 3 });
  }

  async listBlocks(blockId: string): Promise<any[]> {
    return paginate((cursor) =>
      this.queue.add(() =>
        this.client.blocks.children.list({
          block_id: blockId,
          page_size: 100,
          start_cursor: cursor
        })
      )
    );
  }

  async appendBlocks(blockId: string, blocks: any[]): Promise<void> {
    if (
      blocks.length > 1000 ||
      Buffer.byteLength(JSON.stringify(blocks)) > 500 * 1024
    ) {
      throw new Error('payload too large');
    }
    await this.queue.add(() =>
      this.client.blocks.children.append({
        block_id: blockId,
        children: blocks
      })
    );
  }
}
