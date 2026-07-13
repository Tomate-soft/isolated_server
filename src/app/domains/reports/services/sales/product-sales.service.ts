import { Injectable } from '@nestjs/common';
import { SalesService } from './sales.service';

@Injectable()
export class ProductSalesService {
  constructor(private readonly productSalesService: SalesService) {}
  async getProductSales(period: string) {
    const productSales = await this.productSalesService.getSalesReport(period);
    return productSales;
  }
}
