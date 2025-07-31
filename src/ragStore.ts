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

export class ChromaRagStore implements IRagStore {
  private collection: Promise<any>;

  constructor(url: string, collectionName: string, client?: any) {
    const ChromaClient = require('chromadb').ChromaClient;
    const chroma = client ?? new ChromaClient({ path: url });
    this.collection = chroma.getOrCreateCollection({ name: collectionName });
  }

  private async col(): Promise<any> {
    return this.collection;
  }

  async upsert(
    id: string,
    embedding: number[],
    metadata: unknown
  ): Promise<void> {
    const c = await this.col();
    await c.upsert({
      ids: [id],
      embeddings: [embedding],
      metadatas: [metadata]
    });
  }

  async query(embedding: number[], topK: number): Promise<IRagItem[]> {
    const c = await this.col();
    const res = await c.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: ['metadatas', 'ids']
    });
    const ids: string[] = res.ids[0] || [];
    const metas: unknown[] = res.metadatas[0] || [];
    return ids.map((id: string, i: number) => ({
      id,
      embedding: [],
      metadata: metas[i]
    }));
  }
}

export class PineconeRagStore implements IRagStore {
  private index: any;

  constructor(
    apiKey: string,
    environment: string,
    indexName: string,
    client?: any
  ) {
    const Pinecone = require('@pinecone-database/pinecone').Pinecone;
    const pc = client ?? new Pinecone({ apiKey, environment });
    this.index = pc.index(indexName);
  }

  async upsert(
    id: string,
    embedding: number[],
    metadata: unknown
  ): Promise<void> {
    await this.index.upsert([{ id, values: embedding, metadata }]);
  }

  async query(embedding: number[], topK: number): Promise<IRagItem[]> {
    const res = await this.index.query({
      vector: embedding,
      topK,
      includeMetadata: true
    });
    return res.matches.map((m: any) => ({
      id: m.id,
      embedding: [],
      metadata: m.metadata
    }));
  }
}
