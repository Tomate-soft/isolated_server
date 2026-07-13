import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PaymentsService } from '../../services/payments/payments.service';

@Controller('read-payments')
export class ReadPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('all')
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      const response = await this.paymentsService.findAll(page, limit);
      if (!response) {
        throw new NotFoundException('No payments found');
      }
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Ha ocurrido un error inesperado: ${error}`);
    }
  }
}
