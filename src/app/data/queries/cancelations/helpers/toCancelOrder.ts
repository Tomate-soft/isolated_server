import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';
import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { Bills } from '@schema/sales/bills.schema';
import { CreateOrderCancelProps } from 'src/app/domains/operations/cancellations/types/cancellations';

interface Props {
  body: CreateOrderCancelProps;
  orderCancelled: ToGoOrder | RappiOrder | PhoneOrder | Bills;
  type: CancellationTypes;
}

export const toCancelOrder = ({ body, orderCancelled, type }: Props): CreateOrderCancelDto => {
  const byName = `${body.cancelBy}`;
  const forName = `${orderCancelled.userCode} ${orderCancelled.user}`;

  const dataCancel = {
    code: orderCancelled.code,
    cancelType: type,
    amount: parseFloat(orderCancelled.checkTotal),
    cancellationBy: byName,
    cancellationFor: forName,
    cancellationReason: body.cancellationReason,
    description: body.description,
    operatingPeriod: body.operatingPeriod,
  };
  return dataCancel;
};
