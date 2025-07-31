import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { RateLimiter, retryOn429 } from './rateLimiter';
import { TokenCostLogger } from './tokenLogger';
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('gpt-notion');
const requestCounter = meter.createCounter('openai_requests', {
  description: 'Number of OpenAI API requests'
});

export class OpenAIClient {
  private client: OpenAI;
  private limiter: RateLimiter;
  private logger: TokenCostLogger;

  constructor(
    apiKey: string,
    limiter: RateLimiter,
    logger: TokenCostLogger,
    client?: OpenAI
  ) {
    this.limiter = limiter;
    this.logger = logger;
    this.client = client ?? new OpenAI({ apiKey });
  }

  async chat(
    messages: ChatCompletionMessageParam[],
    model = 'gpt-4o-mini'
  ): Promise<string> {
    return retryOn429(() =>
      this.limiter.schedule(async () => {
        requestCounter.add(1);
        const res = await this.client.chat.completions.create({
          messages,
          model
        });
        const tokens = res.usage?.total_tokens ?? 0;
        this.logger.logCost(tokens);
        return res.choices[0]?.message?.content ?? '';
      })
    );
  }
}
