import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { OrderCourtesy } from '@schema/courtesies/oder-courtesy';
import { Bills } from '@schema/sales/bills.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { FINISHED_STATUS, FREE_STATUS } from 'src/libs/status.libs';
import { Table } from 'src/schemas/tables/tableSchema';
import { Discount } from 'src/schemas/ventas/discounts.schema';

@Injectable()
export class PayWithCourtesies {
  constructor(
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(Table.name) private orderCourtesyModel: Model<OrderCourtesy>,
    @InjectConnection() private readonly session: Connection,
  ) {}

  async payOnsiteOrderWithCourtesy(id: string, body: any) {
    let response: Discount;
    await this.session.transaction(async (session: ClientSession) => {
      const bill = await this.billsModel.findOneAndUpdate(
        { _id: id, status: { $ne: FINISHED_STATUS } },
        { $set: { status: FINISHED_STATUS, checkTotal: '0.00' } },
        { new: true, session },
      );

      if (!bill) {
        throw new Error('Bill no encontrada o ya está cerrada');
      }

      const newCourtesy = new this.orderCourtesyModel(body);
      await newCourtesy.save({ session });

      await this.tableModel.findByIdAndUpdate(
        bill.table,
        {
          status: FREE_STATUS,
          bill: [],
        },
        { session },
      );
    });
    return response;
  }
}
