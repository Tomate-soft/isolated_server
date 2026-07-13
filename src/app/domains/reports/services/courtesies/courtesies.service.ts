import { Injectable } from '@nestjs/common';
import { GetPeriodCourtesiesService } from './get-period-courtesies.service';
import { GetProductCourtesiesService } from './get-product-courtesies.service';

@Injectable()
export class CoutesiesService {
  constructor(
    private readonly getPeriodCourtesiesService: GetPeriodCourtesiesService,
    private readonly getProductCourtesiesService: GetProductCourtesiesService,
  ) {}
  async getPeriodCourtesies(period: string) {
    const courtesiesReport = await this.getPeriodCourtesiesService.getCourtesiesByPeriod(period);
    return courtesiesReport;
  }

  async getProductCourtesies(period: string) {
    const productCourtesiesReport =
      await this.getProductCourtesiesService.getCourtesiesByPeriod(period);
    return productCourtesiesReport;
  }
}
