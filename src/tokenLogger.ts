export class TokenCostLogger {
  private total = 0;

  logCost(tokens: number): void {
    this.total += tokens;
    console.log(`[TokenCost] +${tokens} tokens (total: ${this.total})`);
  }

  get totalTokens(): number {
    return this.total;
  }
}
