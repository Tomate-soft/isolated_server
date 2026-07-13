import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';
import { Bills } from '@schema/sales/bills.schema';

export interface Results {
  orders: Bills[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CrudSalesService {
  constructor(private readonly dataRepository: DataRepository) {}

  async findAll(page: number = 1, limit: number = 50): Promise<Results> {
    const results: Results = {
      orders: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
    const { count, data } = await this.dataRepository.readBillsRepository.findAll(page, limit);
    results.orders = data;
    results.total = count;

    if (results.total > 0) {
      results.totalPages = Math.ceil(results.total / limit);
    }

    return results;
  }
}
