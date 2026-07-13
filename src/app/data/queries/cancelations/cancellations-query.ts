import { Injectable } from '@nestjs/common';
import { cancelFactory } from './CancelFactory';
import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';
import { CancelOperator } from './Strategies/types/CancellationStrategy';
import { CancelRappiQuery } from './providers/cancel-rappi-query';
import { CancelTogoQuery } from './providers/cancel-togo-query';
import { CancelOnsiteQuery } from './providers/cancel-onsite-query';
import { CancelPhoneQuery } from './providers/cancel-phone-query';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';

@Injectable()
export class CancellationsQuery {
  constructor(
    private readonly cancelRappiQuery: CancelRappiQuery,
    private readonly cancelTogoQuery: CancelTogoQuery,
    private readonly cancelPhoneQuery: CancelPhoneQuery,
    private readonly cancelOnsiteQuery: CancelOnsiteQuery,
  ) {}

  async cancelEvent(
    type: CancellationTypes | CancellationProductTypes,
    id: string,
    body: any,
  ): Promise<any> {
    const strategy = cancelFactory(
      type,
      this.cancelRappiQuery,
      this.cancelTogoQuery,
      this.cancelPhoneQuery,
      this.cancelOnsiteQuery,
    );
    const cancelOperator = new CancelOperator(strategy);
    return cancelOperator.cancel(id, body);
  }
}
