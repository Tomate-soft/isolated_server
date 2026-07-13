import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CancellationTypes, OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { Bills } from '@schema/sales/bills.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';
import { toCancelOrder } from '../helpers/toCancelOrder';
import { Table } from 'src/schemas/tables/tableSchema';
import { FREE_STATUS } from 'src/libs/status.libs';

@Injectable()
export class CancelOnsiteQuery {
  constructor(
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(OrderCancel.name) private orderCancel: Model<OrderCancel>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async cancelOnSiteOrder(id: string, body: any): Promise<any> {
    let response: CreateOrderCancelDto;
    await this.connection.transaction(async (session: ClientSession) => {
      const orderCancelled = await this.billsModel.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { session, new: true },
      );
      const dataCancel = toCancelOrder({
        body,
        orderCancelled: orderCancelled,
        type: CancellationTypes.BILL_CANCELLATION,
      });
      await this.tableModel.findByIdAndUpdate(orderCancelled.table, {
        status: FREE_STATUS,
        bill: [],
      });
      const newCancel = new this.orderCancel(dataCancel);
      await newCancel.save({ session });

      response = dataCancel;
    });

    return response;
  }
}
