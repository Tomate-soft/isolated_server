import { SaleStrategy } from '../types/sales';

export class SalesContext {
  constructor(private strategy: SaleStrategy) {}

  async executeStrategy(body: any): Promise<any> {
    return this.strategy.execute(body);
  }
}
