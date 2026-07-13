import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class TimeIntegration {
  constructor(private readonly dataQuery: DataQuery) {}

  async getOrdersAttentionTime(period: string) {
    return this.dataQuery.reportsQuery.getOrdersAttentionTime(period);
  }
}
