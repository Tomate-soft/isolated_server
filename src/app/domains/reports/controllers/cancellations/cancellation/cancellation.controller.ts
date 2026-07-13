import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { CancellationsService } from '../../../services/cancellations/cancellations.service';

@Controller('cancellation')
export class CancellationController {
  constructor(private readonly cancellationService: CancellationsService) {}

  @Get('total-cancels-report/:period')
  async getTotalCancelsReport(@Param('period') period: string) {
    try {
      const response = await this.cancellationService.getTotalCancelsReport(period);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error on getTotalCancelsReport: ${error}`);
    }
  }

  @Get('auth-cancellation-details-report/:period')
  async getAuthCancellationDetailsReport(@Param('period') period: string) {
    try {
      const response = await this.cancellationService.getAuthCancellationDetailsReport(period);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error on getAuthCancellationDetailsReport: ${error}`);
    }
  }

  @Get('cancels-orders-by-period/:period')
  async getCancelsOrdersByPeriod(@Param('period') period: string) {
    try {
      const response = await this.cancellationService.getCancelsOrdersByPeriod(period);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error on getCancelsOrdersByPeriod: ${error}`);
    }
  }

  @Get('all-product-cancellations-by-period/:period')
  async getAllProductCancellationsByPeriod(@Param('period') period: string) {
    console.log('Received period: Estamos es el nuevo endpoint', period);
    try {
      const response = await this.cancellationService.getAllProductCancellationsByPeriod(period);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on getAllProductCancellationsByPeriod: ${error}`,
      );
    }
  }
}
