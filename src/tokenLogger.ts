import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('gpt-notion');
const tokenCounter = meter.createCounter('openai_tokens', {
  description: 'Total OpenAI tokens consumed'
});

export class TokenCostLogger {
  private total = 0;

  logCost(tokens: number): void {
    this.total += tokens;
    tokenCounter.add(tokens);
    console.log(`[TokenCost] +${tokens} tokens (total: ${this.total})`);
  }

  get totalTokens(): number {
    return this.total;
  }
}
