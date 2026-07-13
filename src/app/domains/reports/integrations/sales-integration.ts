import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class SalesIntegration {
  constructor(private dataQuery: DataQuery) {}

  async getSellTypeUserSales(period: string, sellType: string) {
    return this.dataQuery.reportsQuery.getTotalSellTypeUserSalesReport(period, sellType);
  }
}
