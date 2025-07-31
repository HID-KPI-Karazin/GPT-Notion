# GPT-Notion

Full-code solution for ChatGPT-Notion integration

This library includes a small wrapper around the official OpenAI SDK. The
`OpenAIClient` class handles rate limiting, automatic retries on HTTP 429
responses and logs token usage via `TokenCostLogger`. The default model is
`gpt-4o-mini`.

Environment variables are used for API keys and other settings. Copy
`.env.example` to `.env` and fill in your values before running commands.

The RAG layer can use an in-memory store, Chroma or Pinecone. Select the
provider via the `RAG_PROVIDER` variable. OpenTelemetry metrics are exposed
via a Prometheus exporter on `http://localhost:9464/metrics` when
`OTEL_EXPORTER=prometheus`. Use `OTEL_EXPORTER=stdout` for local debugging.

See [docs/security.md](docs/security.md) for security guidelines. Pricing and
model limits are documented in [docs/openai.md](docs/openai.md).
