import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { paginate, PaginatedResponse } from '../../helpers/pagination';
import { getByPeriod } from '../../helpers/getByPeriod';
import { togoPopulateHelper } from '../../helpers/populate/togoorder.populate copy';

@Injectable()
export class ReadTogoRepository {
  constructor(@InjectModel(ToGoOrder.name) private toGoOrdersModel: Model<ToGoOrder>) {}

  async findAll(page: number = 1, limit: number = 50): Promise<PaginatedResponse<ToGoOrder>> {
    const model = this.toGoOrdersModel;
    const filter = {};
    const populate = togoPopulateHelper;
    const sort = { createdAt: -1 } as const;
    const response = await paginate<ToGoOrder>(model, page, limit, filter, populate, sort);
    return response;
  }

  async findByOperatingPeriod(operatingPeriod: string): Promise<ToGoOrder[]> {
    const model = this.toGoOrdersModel;
    const populate = [];
    const sort = { createdAt: -1 } as const;
    const response = await getByPeriod<ToGoOrder>(model, operatingPeriod, populate, sort);
    // const pipeline = findByOperatingPeriodPipeline(operatingPeriod, page, limit);
    // const [response] = await this.billsModel.aggregate<PaginatedResponse<Bills>>(pipeline);
    return response;
  }
}
