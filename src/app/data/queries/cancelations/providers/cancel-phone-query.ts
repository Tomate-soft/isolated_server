import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CancellationTypes, OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { toCancelOrder } from '../helpers/toCancelOrder';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import { toCancelProduct } from '../helpers/toCancelProduct';
import { CreateProductCancelProps } from 'src/app/domains/operations/cancellations/types/cancellations';

@Injectable()
export class CancelPhoneQuery {
  constructor(
    @InjectModel(PhoneOrder.name) private phoneOrderModel: Model<PhoneOrder>,
    @InjectModel(OrderCancel.name) private orderCancel: Model<OrderCancel>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async cancelPhoneOrder(id: string, body: any): Promise<any> {
    let response: CreateOrderCancelDto;
    await this.connection.transaction(async (session: ClientSession) => {
      const orderCancelled = await this.phoneOrderModel.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { session, new: true },
      );
      const dataCancel = toCancelOrder({
        body,
        orderCancelled: orderCancelled,
        type: CancellationTypes.PHONE_ORDER_CANCELLATION,
      });

      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = dataCancel;
    });

    return response;
  }

  async cancelPhoneProduct(
    id: string,
    body: CreateProductCancelProps,
    products: any[],
  ): Promise<any> {
    let response: PhoneOrder;
    await this.connection.transaction(async (session: ClientSession) => {
      const order = await this.phoneOrderModel.findByIdAndUpdate(
        id,
        { $set: { products: products } },
        { session, new: true },
      );

      const dataCancel = toCancelProduct({
        body,
        order: order,
        type: CancellationProductTypes.PHONE_ORDER_PRODUCT_CANCELLATION,
      });

      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = order;
    });

    return response;
  }
}
