import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { SalesService } from '../../services/sales/sales.service';

@Controller('product-sales')
export class ProductSalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('get-report/:id')
  async getProductSalesReport(@Param('id') id: string) {
    try {
      const response = await this.salesService.getSalesReport(id);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching product sales report');
    }
  }

  @Get('get-sell-type-user-sales/:period/:sellType')
  async getSellTypeUserSales(@Param('period') period: string, @Param('sellType') sellType: string) {
    try {
      const response = await this.salesService.getSellTypeUserSales(period, sellType);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching sell type user sales');
    }
  }

  @Get('get-product-sales-by-category/:period/:sellType')
  async getProductSalesByCategory(
    @Param('period') period: string,
    @Param('sellType') sellType: string,
  ) {
    try {
      const response = await this.salesService.getProductSalesByCategory(period, sellType);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching product sales by category');
    }
  }
}
