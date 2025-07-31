# Architecture

This project syncs Notion pages with a retrieval augmented generation (RAG) layer
and ChatGPT. The flow is illustrated below.

```mermaid
graph TD
    A[Notion] -->|SyncCommand| B(RAG Store)
    B -->|Context| C[GPT]
    C -->|Response| A
```

The RAG store defaults to an in-memory implementation but can be replaced with
external services like Chroma or Pinecone.

## Metrics

OpenTelemetry metrics record token usage and request counts. Metrics are
exported to stdout for scraping by a Prometheus side-car or other collector.
