import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { Bills } from '@schema/sales/bills.schema';
import { CreateProductCancelDto } from 'src/app/data/dto/cancellations/product-cancel/create-product-cancel.dto';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import { CreateProductCancelProps } from 'src/app/domains/operations/cancellations/types/cancellations';

interface Props {
  body: CreateProductCancelProps;
  order: ToGoOrder | RappiOrder | PhoneOrder | Bills;
  type: CancellationProductTypes;
}

export const toCancelProduct = ({ body, order, type }: Props): CreateProductCancelDto => {
  const byName = `${body.cancelBy}`;
  const forName = `${order.userCode} ${order.user}`;

  const dataCancel = {
    product: body.product, // ✅
    code: order.code, // ✅
    cancelType: type, // ✅
    amount: body.orderTotal, // ✅
    cancellationBy: byName,
    cancellationFor: forName,
    cancellationReason: body.cancellationReason,
    description: body.description,
    operatingPeriod: body.operatingPeriod,
  };
  return dataCancel;
};
