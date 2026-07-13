import { Injectable } from '@nestjs/common';
import { DailyClousureQuery } from './daily-clousure.query';

@Injectable()
export class ClosuresQuery {
  constructor(private readonly dailyClosureQuery: DailyClousureQuery) {}

  async dailyClousure(periodId: string) {
    const response = await this.dailyClosureQuery.execute(periodId);
    return response;
  }
}
