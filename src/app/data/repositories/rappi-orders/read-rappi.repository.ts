import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { paginate, PaginatedResponse } from '../../helpers/pagination';
import { rappiPopulateHelper } from '../../helpers/populate/rappiorders.populate';
import { getByPeriod } from '../../helpers/getByPeriod';

@Injectable()
export class ReadRappiRepository {
  constructor(@InjectModel(RappiOrder.name) private rappiOrdersModel: Model<RappiOrder>) {}

  async findAll(page: number = 1, limit: number = 50): Promise<PaginatedResponse<RappiOrder>> {
    const model = this.rappiOrdersModel;
    const filter = {};
    const populate = rappiPopulateHelper;
    const sort = { createdAt: -1 } as const;
    const response = await paginate<RappiOrder>(model, page, limit, filter, populate, sort);
    return response;
  }

  async findByOperatingPeriod(operatingPeriod: string): Promise<RappiOrder[]> {
    const model = this.rappiOrdersModel;
    const populate = [];
    const sort = { createdAt: -1 } as const;
    const response = await getByPeriod<RappiOrder>(model, operatingPeriod, populate, sort);
    return response;
  }
}
