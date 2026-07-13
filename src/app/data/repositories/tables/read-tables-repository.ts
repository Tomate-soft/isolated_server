import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from 'src/schemas/tables/tableSchema';

@Injectable()
export class ReadTablesRepository {
  constructor(@InjectModel(Table.name) private tableModel: Model<Table>) {}

  async toNextRelease() {
    const tables = await this.tableModel
      .find({ status: 'forPayment' })
      .select('tableNum')
      .sort({ updatedAt: -1 })
      .limit(5)
      .exec();
    return tables;
  }

  async getAllTablesForCheckin() {
    return this.tableModel
      .find()
      .populate({
        path: 'user',
        select: 'name',
      })
      .select('tableNum status user diners tableNum')
      .exec();
  }
}
