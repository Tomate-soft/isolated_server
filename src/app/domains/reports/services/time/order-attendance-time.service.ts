import { Injectable } from '@nestjs/common';
import { TimeIntegration } from '../../integrations/time-integration';

@Injectable()
export class OrderAttendanceTimeService {
  constructor(private readonly timeIntegration: TimeIntegration) {}

  async getOrdersAttentionTime(period: string) {
    return this.timeIntegration.getOrdersAttentionTime(period);
  }
}
