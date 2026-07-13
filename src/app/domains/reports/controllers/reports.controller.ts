import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { TipsService } from '../services/tips/tips.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly tipService: TipsService) {}

  @Get('daily-tips-reports/:id')
  async getDailyTipsReports(@Param('id') id: string) {
    try {
      const response = await this.tipService.getDailyTipsReports(id);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error on getDailyTipsReports: ${error}`);
    }
  }
}
