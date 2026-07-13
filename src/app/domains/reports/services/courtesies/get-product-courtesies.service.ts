import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';

@Injectable()
export class GetProductCourtesiesService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getCourtesiesByPeriod(period: string) {
    const courtesiesReport = await this.integration.getProductsCourtesiesDetailsByPeriod(period);
    return courtesiesReport;
  }
}
