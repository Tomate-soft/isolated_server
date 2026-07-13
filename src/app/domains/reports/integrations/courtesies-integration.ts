import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class CourtesiesIntegration {
  constructor(private readonly dataQuery: DataQuery) {}

  async getCourtesiesReport(period: string) {
    const response = await this.dataQuery.reportsQuery.getAllCourtesiesDetailsByPeriod(period);
    return response;
  }

  async getProductsCourtesiesReport(period: string) {
    const response = await this.dataQuery.reportsQuery.getProductsCourtesiesDetailsByPeriod(period);
    return response;
  }
}
