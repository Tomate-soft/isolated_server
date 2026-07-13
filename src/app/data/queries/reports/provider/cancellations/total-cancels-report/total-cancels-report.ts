import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderCancel } from '@schema/cancellations/order-cancel.schema';
import { Model } from 'mongoose';
import { getCancellationTotalByWaiterPipeline } from '../../../pipelines/get-total-cancels-report';
import { getAuthCancellationTotalByWaiterPipeline } from '../../../pipelines/get-auth-cancels-report';
import { Cancellations } from 'src/schemas/ventas/cancellations.schema';
import { getAllGeneralCancellationsListPipeline } from '../../../pipelines/cancels-list';
import { getAllproductsCancellationsListPipeline } from '../../../pipelines/product-cancels-details';

@Injectable()
export class TotalCancelsReport {
  constructor(
    @InjectModel(OrderCancel.name) private readonly orderCancelModel: Model<OrderCancel>,
    @InjectModel(Cancellations.name) private readonly cancellationsModel: Model<Cancellations>,
  ) {}

  async getTotalCancelsReport(period: string) {
    const pipeline = getCancellationTotalByWaiterPipeline(period);
    return this.orderCancelModel.aggregate(pipeline);
  }

  async getAuthCancellationDetailsReport(period: string) {
    const pipeline = getAuthCancellationTotalByWaiterPipeline(period);
    return this.orderCancelModel.aggregate(pipeline);
  }

  async getCancelsOrdersByPeriod(period: string) {
    const pipeline = getAllGeneralCancellationsListPipeline(period);
    return this.orderCancelModel.aggregate(pipeline);
  }

  async getAllProductCancellationsByPeriod(period: string) {
    const pipeline = getAllproductsCancellationsListPipeline(period);
    return this.cancellationsModel.aggregate(pipeline);
  }
}
