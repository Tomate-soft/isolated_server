import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class OnsiteSalesIntegrations {
  constructor(private readonly dataQuery: DataQuery) {}

  async createEmployeeSale(body: any) {
    const response = await this.dataQuery.salesQuery.CreateEmployeeSale(body);
    return response;
  }
}
