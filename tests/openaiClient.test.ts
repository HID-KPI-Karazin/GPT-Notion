import { OpenAIClient } from '../src/openaiClient';
import { RateLimiter } from '../src/rateLimiter';
import { TokenCostLogger } from '../src/tokenLogger';

class FakeOpenAI {
  chat = {
    completions: {
      create: async () => ({
        choices: [{ message: { content: 'hi' } }],
        usage: { total_tokens: 5 }
      })
    }
  };
}

test('OpenAIClient logs token usage', async () => {
  const limiter = new RateLimiter(10);
  const logger = new TokenCostLogger();
  const client = new OpenAIClient(
    'sk-test',
    limiter,
    logger,
    new FakeOpenAI() as any
  );
  const result = await client.chat([{ role: 'user', content: 'hello' }]);
  expect(result).toBe('hi');
  expect(logger.totalTokens).toBe(5);
  limiter.stop();
});
