export default class PQueue {
  // Minimal mock just executes tasks immediately
  // eslint-disable-next-line no-unused-vars
  constructor(public opts: any) {}
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}
