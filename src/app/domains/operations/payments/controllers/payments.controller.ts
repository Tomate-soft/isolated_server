import { Body, Controller, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentDto } from 'src/dto/ventas/payments/createPaymentDto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pay-onsite-order/:id')
  async payOnsiteOrder(@Param('id') id: string, @Body() body: CreatePaymentDto) {
    try {
      const response = await this.paymentsService.payOnsiteOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al pagar el pedido: ${error}`);
    }
  }

  @Post('pay-note-in-bill/:id')
  async payNoteInBill(@Param('id') id: string, @Body() body: CreatePaymentDto) {
    try {
      const response = await this.paymentsService.payNoteInBill(id, body);
      return response;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Error al pagar el pedido: ${error}`);
    }
  }

  @Post('pay-togo-order/:id')
  async payTogoOrder(@Param('id') id: string, @Body() body: CreatePaymentDto) {
    try {
      const response = await this.paymentsService.payTogoOrder(id, body);
      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Error al pagar el pedido: ${error}`);
    }
  }

  @Post('pay-rappi-order/:id')
  async payRappiOrder(@Param('id') id: string, @Body() body: CreatePaymentDto) {
    try {
      const response = await this.paymentsService.payRappiOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al pagar el pedido: ${error}`);
    }
  }

  @Post('pay-phone-order/:id')
  async payPhoneOrder(@Param('id') id: string, @Body() body: CreatePaymentDto) {
    try {
      const response = await this.paymentsService.payPhoneOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al pagar el pedido: ${error}`);
    }
  }
}
