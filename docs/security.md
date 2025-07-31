# Security Policy

This project integrates Notion with OpenAI via a minimal RAG layer. The following guidelines help keep data and tokens safe.

## Secrets management

- Store OpenAI and Notion API keys in environment variables. Use `.env.example` as a template.
- Never commit secrets to the repository. Rotate keys immediately if exposed.

## Data handling

- Notion sync is subject to platform limits: 1000 blocks or 500 KB per record.
- Pagination via `start_cursor` (up to 100 objects) is recommended to avoid timeouts.
- When using an external RAG store (e.g. Chroma, Pinecone), ensure the service implements proper access controls.

## Token usage

- `TokenCostLogger` records tokens consumed per request. Monitor usage to stay within OpenAI rate limits, which may change at any time.

## Observability

- OpenTelemetry metrics are exported to stdout by default. Use a Prometheus sidecar or configure another backend as needed.

## Reporting a vulnerability

Please open an issue or email `security@example.com` with details.
