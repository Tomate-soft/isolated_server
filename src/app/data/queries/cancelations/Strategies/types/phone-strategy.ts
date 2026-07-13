import { CancelPhoneQuery } from '../../providers/cancel-phone-query';
import { CancellationStrategy } from './CancellationStrategy';

export class CancelPhoneOrder implements CancellationStrategy {
  constructor(private service: CancelPhoneQuery) {}

  cancel(id: string, body: any): Promise<any> {
    return this.service.cancelPhoneOrder(id, body);
  }
}

export class CancelPhoneProduct implements CancellationStrategy {
  constructor(private service: CancelPhoneQuery) {}

  cancel(id: string, body: any): Promise<any> {
    const products = body.products;
    const cancelBody = body.body;
    return this.service.cancelPhoneProduct(id, cancelBody, products);
  }
}
