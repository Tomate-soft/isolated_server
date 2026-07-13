import { CancelRappiQuery } from '../../providers/cancel-rappi-query';
import { CancellationStrategy } from './CancellationStrategy';

export class CancelRappiOrder implements CancellationStrategy {
  constructor(private service: CancelRappiQuery) {}

  cancel(id: string, body: any): Promise<any> {
    return this.service.cancelRappiOrder(id, body);
  }
}

export class CancelRappiProduct implements CancellationStrategy {
  constructor(private service: CancelRappiQuery) {}

  cancel(id: string, body: any): Promise<any> {
    const products = body.products;
    const cancelBody = body.body;
    return this.service.cancelRappiProduct(id, cancelBody, products);
  }
}
