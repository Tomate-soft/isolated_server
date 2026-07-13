import { CancelTogoQuery } from '../../providers/cancel-togo-query';
import { CancellationStrategy } from './CancellationStrategy';

export class CancelToGoOrder implements CancellationStrategy {
  constructor(private service: CancelTogoQuery) {}

  cancel(id: string, body: any): Promise<any> {
    return this.service.cancelTogoOrder(id, body);
  }
}

export class CancelToGoProduct implements CancellationStrategy {
  constructor(private service: CancelTogoQuery) {}

  cancel(id: string, body: any): Promise<any> {
    const products = body.products;
    const cancelBody = body.body;
    return this.service.calcelToGoProduct(id, cancelBody, products);
  }
}
