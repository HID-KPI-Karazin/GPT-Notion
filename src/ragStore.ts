export interface IRagItem {
  id: string;
  embedding: number[];
  metadata: unknown;
}

/* eslint-disable no-unused-vars */
export interface IRagStore {
  upsert(id: string, embedding: number[], metadata: unknown): Promise<void>;
  query(embedding: number[], topK: number): Promise<IRagItem[]>;
}
/* eslint-enable no-unused-vars */

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length && i < b.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (!normA || !normB) return 0;
  return dot / Math.sqrt(normA * normB);
}

export class InMemoryRagStore implements IRagStore {
  private store = new Map<string, { embedding: number[]; metadata: unknown }>();

  async upsert(
    id: string,
    embedding: number[],
    metadata: unknown
  ): Promise<void> {
    this.store.set(id, { embedding, metadata });
  }

  async query(embedding: number[], topK: number): Promise<IRagItem[]> {
    const results: Array<{ id: string; score: number; metadata: unknown }> = [];
    for (const [id, value] of this.store.entries()) {
      const score = cosineSimilarity(value.embedding, embedding);
      results.push({ id, score, metadata: value.metadata });
    }
    results.sort((a, b) => b.score - a.score);
    return results
      .slice(0, topK)
      .map((r) => ({ id: r.id, embedding: [], metadata: r.metadata }));
  }
}
