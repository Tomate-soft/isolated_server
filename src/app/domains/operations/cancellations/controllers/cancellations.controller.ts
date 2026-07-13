import { Body, Controller, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { CancellationsService } from '../services/cancellations.service';
import { CreateOrderCancelProps } from '../types/cancellations';

@Controller('cancellations')
export class CancellationsController {
  constructor(private readonly cancellationsService: CancellationsService) {}

  @Patch('cancel-togo-order/:id')
  async cancelTogoOrder(@Param('id') id: string, @Body() body: CreateOrderCancelProps) {
    try {
      const response = await this.cancellationsService.cancelTogoOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar la orden: ${error}`);
    }
  }

  @Patch('cancel-rappi-order/:id')
  async cancelRappiOrder(@Param('id') id: string, @Body() body: CreateOrderCancelProps) {
    try {
      const response = await this.cancellationsService.cancelRappiOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar la orden: ${error}`);
    }
  }

  @Patch('cancel-phone-order/:id')
  async cancelPhoneOrder(@Param('id') id: string, @Body() body: CreateOrderCancelProps) {
    try {
      const response = await this.cancellationsService.cancelPhoneOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar la orden: ${error}`);
    }
  }

  @Patch('cancel-onsite-order/:id')
  async cancelOnSiteOrder(@Param('id') id: string, @Body() body: CreateOrderCancelProps) {
    try {
      const response = await this.cancellationsService.cancelOnSiteOrder(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar la orden: ${error}`);
    }
  }

  @Post('cancel-togo-product/:id')
  async cancelTogoProduct(@Param('id') id: string, @Body() body: any) {
    try {
      const response = await this.cancellationsService.cancelTogoProduct(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar el producto: ${error}`);
    }
  }
  @Post('cancel-rappi-product/:id')
  async cancelRappiProduct(@Param('id') id: string, @Body() body: any) {
    try {
      const response = await this.cancellationsService.cancelRappiProduct(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar el producto: ${error}`);
    }
  }

  @Post('cancel-phone-product/:id')
  async cancelPhoneProduct(@Param('id') id: string, @Body() body: any) {
    try {
      const response = await this.cancellationsService.cancelPhoneProduct(id, body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error al cancelar el producto: ${error}`);
    }
  }
}
