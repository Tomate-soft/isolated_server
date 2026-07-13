import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from '../../helpers/pagination';
import { OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { getByPeriod } from '../../helpers/getByPeriod';

@Injectable()
export class ReadCancellations {
  constructor(@InjectModel(OrderCancel.name) private cancellationOrderModel: Model<OrderCancel>) {}

  async findAllOrderCancels(page: number = 1, limit: number = 10) {
    const model = this.cancellationOrderModel;
    const filter = {};
    const populate = [];
    const sort = { createdAt: -1 } as const;
    const response = await paginate<OrderCancel>(model, page, limit, filter, populate, sort);
    return response;
  }

  async findByPeriodOrderCancels(period: string) {
    const model = this.cancellationOrderModel;
    const populate = [];
    const sort = { createdAt: -1 } as const;
    const response = await getByPeriod<OrderCancel>(model, period, populate, sort);
    return response;
  }
}
