export interface RagQueryResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
}

export interface IRagStore {
  upsert(
    id: string,
    embedding: number[],
    metadata: Record<string, any>
  ): Promise<void>;
  query(embedding: number[], topK: number): Promise<RagQueryResult[]>;
}

export class InMemoryRagStore implements IRagStore {
  private items = new Map<
    string,
    { embedding: number[]; metadata: Record<string, any> }
  >();

  async upsert(
    id: string,
    embedding: number[],
    metadata: Record<string, any>
  ): Promise<void> {
    this.items.set(id, { embedding, metadata });
  }

  async query(embedding: number[], topK: number): Promise<RagQueryResult[]> {
    const results: RagQueryResult[] = [];
    for (const [id, item] of this.items) {
      const score = cosineSimilarity(item.embedding, embedding);
      results.push({ id, score, metadata: item.metadata });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
  const denom = normA * normB;
  return denom === 0 ? 0 : dot / denom;
}
