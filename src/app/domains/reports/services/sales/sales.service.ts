import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';

@Injectable()
export class SalesService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getSalesReport(period: string) {
    const salesReport = await this.integration.getProductSalesByPeriodId(period);
    return salesReport;
  }

  async getSellTypeUserSales(period: string, sellType: string) {
    return this.integration.getSellTypeUserSales(period, sellType);
  }

  async getProductSalesByCategory(period: string, sellType: string) {
    return this.integration.getProductSalesByCategory(period, sellType);
  }
}
