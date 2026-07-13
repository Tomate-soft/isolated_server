import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';
import { Model } from 'mongoose';
import { getOrderAttentionTimePipeline } from '../../pipelines/time/get-order-attention-time';

@Injectable()
export class OrderAttentionTime {
  constructor(@InjectModel(Bills.name) private readonly billsModel: Model<Bills>) {}

  async getOrderAttentionTime(period: string) {
    const pipeline = getOrderAttentionTimePipeline(period);
    return await this.billsModel.aggregate(pipeline);
  }
}
