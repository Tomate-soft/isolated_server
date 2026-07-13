import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { CoutesiesService } from '../../services/courtesies/courtesies.service';

@Controller('courtesies')
export class CoutesiesController {
  constructor(private readonly coutesiesService: CoutesiesService) {}

  @Get('order-courtesies-details/:period')
  async getCourtesiesReport(@Param('period') period: string) {
    try {
      const report = await this.coutesiesService.getPeriodCourtesies(period);
      return report;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch courtesies report');
    }
  }

  @Get('product-courtesies-details/:period')
  async getProductsCourtesiesReport(@Param('period') period: string) {
    try {
      const report = await this.coutesiesService.getProductCourtesies(period);
      return report;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch product courtesies report');
    }
  }
}
