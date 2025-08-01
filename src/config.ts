import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'test') {
  config();
}

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';
export const OTEL_EXPORTER = process.env.OTEL_EXPORTER || 'stdout';
export const OTEL_PROM_HOST = process.env.OTEL_PROM_HOST || '0.0.0.0';
export const OTEL_PROM_PORT = Number(process.env.OTEL_PROM_PORT || 9464);
export const RAG_PROVIDER = process.env.RAG_PROVIDER || 'memory';
export const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
export const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || '';
export const PINECONE_INDEX = process.env.PINECONE_INDEX || '';
