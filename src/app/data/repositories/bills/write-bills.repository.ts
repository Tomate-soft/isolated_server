import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { Model } from 'mongoose';

@Injectable()
export class WriteBillsRepository {
  constructor(@InjectModel(Bills.name) private billsModel: Model<Bills>) {}

  // async createBill(body: any) {
  //     const newBill = new this.billsModel(body);
  //     return await newBill.save();
  // }

  async modifyOnSiteOrderProperties(id: string, body: any) {
    const newOnSiteOrder = await this.billsModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return newOnSiteOrder;
  }
}
