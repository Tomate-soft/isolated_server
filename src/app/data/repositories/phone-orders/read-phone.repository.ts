import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { paginate, PaginatedResponse } from '../../helpers/pagination';
import { phonePopulateHelper } from '../../helpers/populate/phoneorders.populate';
import { getByPeriod } from '../../helpers/getByPeriod';

@Injectable()
export class ReadPhoneRepository {
  constructor(@InjectModel(PhoneOrder.name) private phoneOrdersModel: Model<PhoneOrder>) {}

  async findAll(page: number = 1, limit: number = 50): Promise<PaginatedResponse<PhoneOrder>> {
    const model = this.phoneOrdersModel;
    const filter = {};
    const populate = phonePopulateHelper;
    const sort = { createdAt: -1 } as const;
    const response = await paginate<PhoneOrder>(model, page, limit, filter, populate, sort);
    return response;
  }

  async findByOperatingPeriod(operatingPeriod: string): Promise<PhoneOrder[]> {
    const model = this.phoneOrdersModel;
    const populate = [];
    const sort = { createdAt: -1 } as const;
    const response = await getByPeriod<PhoneOrder>(model, operatingPeriod, populate, sort);
    return response;
  }
}
