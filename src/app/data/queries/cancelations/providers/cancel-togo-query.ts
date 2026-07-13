import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CancellationTypes, OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { toCancelOrder } from '../helpers/toCancelOrder';
import {
  CreateOrderCancelProps,
  CreateProductCancelProps,
} from 'src/app/domains/operations/cancellations/types/cancellations';
import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import { toCancelProduct } from '../helpers/toCancelProduct';

@Injectable()
export class CancelTogoQuery {
  constructor(
    @InjectModel(ToGoOrder.name) private toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(OrderCancel.name) private orderCancel: Model<OrderCancel>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async cancelTogoOrder(id: string, body: CreateOrderCancelProps): Promise<any> {
    let response: CreateOrderCancelDto;
    await this.connection.transaction(async (session: ClientSession) => {
      const orderCancelled = await this.toGoOrderModel.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { session, new: true },
      );
      const dataCancel = toCancelOrder({
        body,
        orderCancelled: orderCancelled,
        type: CancellationTypes.TOGO_ORDER_CANCELLATION,
      });

      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = dataCancel;
    });

    return response;
  }

  async calcelToGoProduct(
    id: string,
    body: CreateProductCancelProps,
    products: any[],
  ): Promise<any> {
    let response: ToGoOrder;
    await this.connection.transaction(async (session: ClientSession) => {
      const order = await this.toGoOrderModel.findByIdAndUpdate(
        id,
        { $set: { products: products } },
        { session, new: true },
      );

      const dataCancel = toCancelProduct({
        body,
        order: order,
        type: CancellationProductTypes.TOGO_ORDER_PRODUCT_CANCELLATION,
      });

      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = order;
    });

    return response;
  }
}
