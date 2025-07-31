import {
  OPENAI_API_KEY,
  NOTION_API_KEY,
  NOTION_DATABASE_ID,
  OTEL_EXPORTER,
  RAG_PROVIDER,
  CHROMA_URL,
  PINECONE_API_KEY,
  PINECONE_ENVIRONMENT,
  PINECONE_INDEX
} from '../src/config';

test('env variables load with defaults', () => {
  expect(OPENAI_API_KEY).toBe('');
  expect(NOTION_API_KEY).toBe('');
  expect(NOTION_DATABASE_ID).toBe('');
  expect(OTEL_EXPORTER).toBe('stdout');
  expect(RAG_PROVIDER).toBe('memory');
  expect(CHROMA_URL).toBe('http://localhost:8000');
  expect(PINECONE_API_KEY).toBe('');
  expect(PINECONE_ENVIRONMENT).toBe('');
  expect(PINECONE_INDEX).toBe('');
});
