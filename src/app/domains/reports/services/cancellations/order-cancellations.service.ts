import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';

@Injectable()
export class OrderCancellationsService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getTotalCancelsReport(period: string) {
    return this.integration.getTotalCancelsReport(period);
  }

  async getAuthCancellationDetailsReport(period: string) {
    return this.integration.getAuthCancellationDetailsReport(period);
  }

  async getCancelsOrdersByPeriod(period: string) {
    return this.integration.getCancelsOrdersByPeriod(period);
  }
}
