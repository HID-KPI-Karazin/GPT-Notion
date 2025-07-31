# GPT-Notion

Full-code solution for ChatGPT-Notion integration

This library includes a small wrapper around the official OpenAI SDK. The
`OpenAIClient` class handles rate limiting, automatic retries on HTTP 429
responses and logs token usage via `TokenCostLogger`.

Environment variables are used for API keys and other settings. Copy
`.env.example` to `.env` and fill in your values before running commands.

See [docs/security.md](docs/security.md) for security guidelines.
