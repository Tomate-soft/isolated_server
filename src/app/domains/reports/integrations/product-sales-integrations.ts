import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class ProductSalesIntegrations {
  constructor(private readonly dataQuery: DataQuery) {}

  async getProductSalesByPeriodId(period: string) {
    const result = await this.dataQuery.productSalesQuery.getAllSalesForProduct(period);
    return result;
  }

  async getProductSalesByCategory(period: string, sellType: string) {
    const result = await this.dataQuery.reportsQuery.getProductSalesByCategory(period, sellType);
    return result;
  }
}
