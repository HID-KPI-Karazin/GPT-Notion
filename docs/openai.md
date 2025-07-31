# OpenAI Pricing and Limits

This project uses the official OpenAI SDK. The default chat model is `gpt-4o-mini`.

See <https://openai.com/pricing> for up-to-date pricing information. At the time
of writing `gpt-4o-mini` costs about $0.005 per 1K input tokens and
$0.015 per 1K output tokens.

Rate limits vary by account tier. The `OpenAIClient` automatically retries with
exponential backoff starting at 3000&nbsp;ms when it encounters HTTP 429 errors.
Monitor usage closely to avoid unexpected costs.