import { Injectable } from '@nestjs/common';
import { OnsiteSalesIntegrations } from './onsite-sales-integrations';

@Injectable()
export class SalesIntegrations {
  constructor(private readonly onsiteSalesIntegration: OnsiteSalesIntegrations) {}

  async createEmployeeSale(body: any) {
    const response = await this.onsiteSalesIntegration.createEmployeeSale(body);
    return response;
  }
}
