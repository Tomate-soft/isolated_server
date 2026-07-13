import { Injectable } from '@nestjs/common';
import { SalesIntegrations } from '../../integrations/sales-integrations';

@Injectable()
export class EmployeeSalesService {
  constructor(private readonly integration: SalesIntegrations) {}

  async createEmployeeSale(body: any) {
    const response = await this.integration.createEmployeeSale(body);
    return response;
  }
}
