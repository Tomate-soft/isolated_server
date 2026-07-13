import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';

@Injectable()
export class GetPeriodCourtesiesService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getCourtesiesByPeriod(period: string) {
    const response = await this.integration.getAllCourtesiesDetailsByPeriod(period);
    return response;
  }
}
