import { Injectable } from '@nestjs/common';
import { DailyClousureService } from './daily-clousure.service';

@Injectable()
export class ClousureService {
  constructor(private readonly dailyClousureService: DailyClousureService) {}

  async dailyClousure(periodId: string) {
    const response = await this.dailyClousureService.execute(periodId);
    return response;
  }
}
