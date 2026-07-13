import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';

@Injectable()
export class EmployeeOrdersService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getEmployeeOrdersForReport(id: string) {
    const response = this.integration.getEmployeeOrderReport(id);
    return response;
  }
}
