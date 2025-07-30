import OpenAI, { ChatCompletionMessageParam } from 'openai';
import { RateLimiter, retryOn429 } from './rateLimiter';
import { TokenCostLogger } from './tokenLogger';

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
    model = 'gpt-3.5-turbo'
  ): Promise<string> {
    return retryOn429(() =>
      this.limiter.schedule(async () => {
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
