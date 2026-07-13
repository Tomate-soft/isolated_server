import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CancellationTypes, OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import {
  CreateOrderCancelProps,
  CreateProductCancelProps,
} from 'src/app/domains/operations/cancellations/types/cancellations';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { toCancelOrder } from '../helpers/toCancelOrder';
import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import { toCancelProduct } from '../helpers/toCancelProduct';

@Injectable()
export class CancelRappiQuery {
  constructor(
    @InjectModel(RappiOrder.name) private rappiOrderModel: Model<RappiOrder>,
    @InjectModel(OrderCancel.name) private orderCancel: Model<OrderCancel>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async cancelRappiOrder(id: string, body: CreateOrderCancelProps): Promise<any> {
    let response: CreateOrderCancelDto;
    await this.connection.transaction(async (session: ClientSession) => {
      const orderCancelled = await this.rappiOrderModel.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { session, new: true },
      );
      const dataCancel = toCancelOrder({
        body,
        orderCancelled: orderCancelled,
        type: CancellationTypes.RAPPI_ORDER_CANCELLATION,
      });

      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = dataCancel;
    });
    return response;
  }

  async cancelRappiProduct(
    id: string,
    body: CreateProductCancelProps,
    products: any[],
  ): Promise<any> {
    let response: RappiOrder;
    await this.connection.transaction(async (session: ClientSession) => {
      const order = await this.rappiOrderModel.findByIdAndUpdate(
        id,
        { $set: { products: products } },
        { session, new: true },
      );

      const dataCancel = toCancelProduct({
        body,
        order: order,
        type: CancellationProductTypes.RAPPI_ORDER_PRODUCT_CANCELLATION,
      });

      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = order;
    });

    return response;
  }
}
