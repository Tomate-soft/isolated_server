export interface CancellationStrategy {
  cancel(id: string, body: any): Promise<any>;
}

export class CancelOperator {
  constructor(private strategy: CancellationStrategy) {}

  async cancel(id: string, body: any): Promise<any> {
    return this.strategy.cancel(id, body);
  }
}
