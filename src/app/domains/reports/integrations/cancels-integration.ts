import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class CancelsIntegration {
  constructor(private dataQuery: DataQuery) {}

  async getTotalCancelsReport(period: string) {
    return this.dataQuery.reportsQuery.getTotalCancelsReport(period);
  }

  async getAuthCancellationDetailsReport(period: string) {
    return this.dataQuery.reportsQuery.getAuthCancellationDetailsReport(period);
  }

  async getCancelsOrdersByPeriod(period: string) {
    return this.dataQuery.reportsQuery.getCancelsOrdersByPeriod(period);
  }

  async getAllProductCancellationsByPeriod(period: string) {
    return this.dataQuery.reportsQuery.getProductCancelsDetailsReport(period);
  }
}
