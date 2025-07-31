beforeEach(() => {
  jest.resetModules();
  delete process.env.OPENAI_API_KEY;
  delete process.env.NOTION_API_KEY;
  delete process.env.NOTION_DATABASE_ID;
  delete process.env.OTEL_EXPORTER;
  delete process.env.OTEL_PROM_HOST;
  delete process.env.OTEL_PROM_PORT;
  delete process.env.RAG_PROVIDER;
  delete process.env.CHROMA_URL;
  delete process.env.PINECONE_API_KEY;
  delete process.env.PINECONE_ENVIRONMENT;
  delete process.env.PINECONE_INDEX;
});


test('env variables load with defaults', () => {
  const {
    OPENAI_API_KEY,
    NOTION_API_KEY,
    NOTION_DATABASE_ID,
    OTEL_EXPORTER,
    OTEL_PROM_HOST,
    OTEL_PROM_PORT,
    RAG_PROVIDER,
    CHROMA_URL,
    PINECONE_API_KEY,
    PINECONE_ENVIRONMENT,
    PINECONE_INDEX
  } = require('../src/config');

  expect(OPENAI_API_KEY).toBe('');
  expect(NOTION_API_KEY).toBe('');
  expect(NOTION_DATABASE_ID).toBe('');
  expect(OTEL_EXPORTER).toBe('stdout');
  expect(OTEL_PROM_HOST).toBe('0.0.0.0');
  expect(OTEL_PROM_PORT).toBe(9464);
  expect(RAG_PROVIDER).toBe('memory');
  expect(CHROMA_URL).toBe('http://localhost:8000');
  expect(PINECONE_API_KEY).toBe('');
  expect(PINECONE_ENVIRONMENT).toBe('');
  expect(PINECONE_INDEX).toBe('');
});
