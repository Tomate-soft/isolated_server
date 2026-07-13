import { Injectable } from '@nestjs/common';
import { DailyTipsReportsService } from './daily-tips-reports.service';

@Injectable()
export class TipsService {
  constructor(private readonly dailyTipsReportsService: DailyTipsReportsService) {}
  async getDailyTipsReports(id: string) {
    const response = await this.dailyTipsReportsService.getDailyTipsReports(id);
    return response;
  }
}
