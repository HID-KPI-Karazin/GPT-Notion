import { Client, collectPaginatedAPI } from '@notionhq/client';
import type { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import type PQueue from 'p-queue';
import { retryOn429 } from './rateLimiter';

const MAX_BLOCKS = 1000;
const MAX_SIZE = 500 * 1024; // bytes

export class NotionConnector {
  private notion: Client;
  private queue?: PQueue;

  constructor(apiKey: string, client?: Client) {
    this.notion = client ?? new Client({ auth: apiKey });
  }

  private async getQueue(): Promise<PQueue> {
    if (!this.queue) {
      const mod = await import('p-queue');
      const PQ = mod.default;
      this.queue = new PQ({ concurrency: 1, intervalCap: 3, interval: 1000 });
    }
    return this.queue;
  }

  async listChildrenPaged(
    blockId: string,
    startCursor?: string
  ): Promise<ListBlockChildrenResponse> {
    const q = await this.getQueue();
    return retryOn429(() =>
      q.add(() =>
        this.notion.blocks.children.list({
          block_id: blockId,
          page_size: 100,
          start_cursor: startCursor
        })
      )
    ) as Promise<ListBlockChildrenResponse>;
  }

  async collectAllChildren(
    blockId: string
  ): Promise<ListBlockChildrenResponse> {
    const results = await collectPaginatedAPI(
      (args) => this.listChildrenPaged(blockId, args.start_cursor),
      { start_cursor: undefined }
    );
    return { object: 'list', results } as ListBlockChildrenResponse;
  }

  async appendChildrenChecked(blockId: string, children: any[]): Promise<void> {
    if (children.length > MAX_BLOCKS) {
      throw new Error('Cannot write more than 1000 blocks at once');
    }
    const size = Buffer.byteLength(JSON.stringify(children), 'utf8');
    if (size > MAX_SIZE) {
      throw new Error('Payload exceeds 500KB');
    }
    const q = await this.getQueue();
    await retryOn429(() =>
      q.add(() =>
        this.notion.blocks.children.append({ block_id: blockId, children })
      )
    );
  }
}
