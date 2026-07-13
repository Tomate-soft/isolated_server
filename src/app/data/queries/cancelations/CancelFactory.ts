import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';
import { CancelToGoOrder, CancelToGoProduct } from './Strategies/types/togo-strategy';
import { CancelRappiQuery } from './providers/cancel-rappi-query';
import { CancelTogoQuery } from './providers/cancel-togo-query';
import { CancelRappiOrder, CancelRappiProduct } from './Strategies/types/rappi-strategy';
import { CancellationStrategy } from './Strategies/types/CancellationStrategy';
import { CancelPhoneOrder, CancelPhoneProduct } from './Strategies/types/phone-strategy';
import { CancelOnSiteOrder } from './Strategies/types/onsite-strategy';
import { CancelPhoneQuery } from './providers/cancel-phone-query';
import { CancelOnsiteQuery } from './providers/cancel-onsite-query';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';

export function cancelFactory(
  type: CancellationTypes | CancellationProductTypes,
  cancelRappiQuery: CancelRappiQuery,
  cancelTogoQuery: CancelTogoQuery,
  cancelPhoneQuery: CancelPhoneQuery,
  cancelOnsiteQuery: CancelOnsiteQuery,
): CancellationStrategy {
  if (type === CancellationTypes.TOGO_ORDER_CANCELLATION) {
    return new CancelToGoOrder(cancelTogoQuery);
  }

  if (type === CancellationTypes.RAPPI_ORDER_CANCELLATION) {
    return new CancelRappiOrder(cancelRappiQuery);
  }

  if (type === CancellationTypes.PHONE_ORDER_CANCELLATION) {
    return new CancelPhoneOrder(cancelPhoneQuery);
  }

  if (type === CancellationTypes.BILL_CANCELLATION) {
    return new CancelOnSiteOrder(cancelOnsiteQuery);
  }

  // cancel product strategies
  if (type === CancellationProductTypes.TOGO_ORDER_PRODUCT_CANCELLATION) {
    return new CancelToGoProduct(cancelTogoQuery);
  }

  if (type === CancellationProductTypes.RAPPI_ORDER_PRODUCT_CANCELLATION) {
    return new CancelRappiProduct(cancelRappiQuery);
  }

  if (type === CancellationProductTypes.PHONE_ORDER_PRODUCT_CANCELLATION) {
    return new CancelPhoneProduct(cancelPhoneQuery);
  }

  throw new Error('Cancellation type not found');
}
