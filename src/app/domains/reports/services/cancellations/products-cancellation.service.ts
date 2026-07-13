import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';

@Injectable()
export class ProductsCancellationService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getAllProductCancellationsByPeriod(period: string) {
    return this.integration.getAllProductCancellationsByPeriod(period);
  }
}
