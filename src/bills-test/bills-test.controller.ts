// bills/bills-test.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bills } from '@schema/sales/bills.schema';

@Controller('bills-test')
export class BillsTestController {
  constructor(@InjectModel(Bills.name) private readonly billsModel: Model<Bills>) {}

  @Get('secondary')
  async readFromSecondary() {
    // Lectura desde secondaryPreferred
    const doc = await this.billsModel.findOne();

    // Retornar el documento y la info de read preference
    return {
      doc,
      readPreference: 'secondaryPreferred',
    };
  }
}
