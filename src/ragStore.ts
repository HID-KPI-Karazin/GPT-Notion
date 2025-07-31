export interface RagResult {
  id: string;
  metadata: unknown;
  score: number;
}

export interface IRagStore {
  upsert(id: string, embedding: number[], metadata: unknown): Promise<void>;
  query(embedding: number[], topK: number): Promise<RagResult[]>;
}

function distance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export class InMemoryRagStore implements IRagStore {
  private store = new Map<string, { embedding: number[]; metadata: unknown }>();

  async upsert(id: string, embedding: number[], metadata: unknown): Promise<void> {
    this.store.set(id, { embedding, metadata });
  }

  async query(embedding: number[], topK: number): Promise<RagResult[]> {
    const results: RagResult[] = [];
    for (const [id, entry] of this.store.entries()) {
      const score = distance(entry.embedding, embedding);
      results.push({ id, metadata: entry.metadata, score });
    }
    results.sort((a, b) => a.score - b.score);
    return results.slice(0, topK);
  }
}
