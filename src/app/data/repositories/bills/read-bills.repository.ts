import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate, PaginatedResponse } from '../../helpers/pagination';
import { billPopulateHelper } from '../../helpers/populate/bills.populate';
import { getByPeriod } from '../../helpers/getByPeriod';
import { Bills } from '@schema/sales/bills.schema';

@Injectable()
export class ReadBillsRepository {
  constructor(@InjectModel(Bills.name) private billsModel: Model<Bills>) {}

  async findAll(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Bills>> {
    const model = this.billsModel;
    const filter = {};
    const populate = billPopulateHelper;
    const sort = { createdAt: -1 } as const;
    const response = await paginate<Bills>(model, page, limit, filter, populate, sort);
    return response;
  }

  async findByOperatingPeriod(operatingPeriod: string): Promise<Bills[]> {
    const model = this.billsModel;
    const populate = [];
    const sort = { createdAt: -1 } as const;
    const response = await getByPeriod<Bills>(model, operatingPeriod, populate, sort);
    // const pipeline = findByOperatingPeriodPipeline(operatingPeriod, page, limit);
    // const [response] = await this.billsModel.aggregate<PaginatedResponse<Bills>>(pipeline);
    return response;
  }
}
