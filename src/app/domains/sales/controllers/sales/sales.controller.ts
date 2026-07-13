import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { SalesService } from '../../services/sales/sales.service';
import { EmployeeSalesService } from '../../services/employee-sales/employee-sales.service';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly employeeSales: EmployeeSalesService,
  ) {}

  @Get('all')
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      const sales = await this.salesService.findAll(page, limit);
      if (!sales) {
        throw new NotFoundException('No sales found');
      }
      return sales;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('create-employee-sale')
  async createEmployeeSale(@Body() body: any) {
    try {
      const sale = await this.employeeSales.createEmployeeSale(body);
      if (!sale) {
        throw new NotFoundException('Sale could not be created');
      }
      return sale;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
