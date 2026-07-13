import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { OrdersService } from '../../services/orders/orders.service';

@Controller('order-reports')
export class OrderReportsController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('employee-orders/:id')
  async getEmployeeOrdersReport(@Param('id') id: string) {
    try {
      const response = await this.orderService.getEmployeeOrdersForReport(id);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching orders report');
    }
  }
}
