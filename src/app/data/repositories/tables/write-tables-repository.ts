import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FREE_STATUS } from 'src/libs/status.libs';
import { Table } from 'src/schemas/tables/tableSchema';

@Injectable()
export class WriteTablesRepository {
  constructor(@InjectModel(Table.name) private tableModel: Model<Table>) {}

  async modifyTableProperties(id: string, body: any) {
    const newTable = await this.tableModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return newTable;
  }
  // log
  async tableCheckinAperture(id: string, body: any) {
    const table = await this.tableModel.findById(id);
    if (table.status !== FREE_STATUS) {
      throw new ConflictException('La mesa se encuentra ocupada');
    }
    const newTable = await this.tableModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return newTable;
  }
}
