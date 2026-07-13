import { Injectable } from '@nestjs/common';
import { OrderAttendanceTimeService } from './order-attendance-time.service';

@Injectable()
export class TimeService {
  constructor(private readonly orderAttendanceTimeService: OrderAttendanceTimeService) {}

  async getOrdersAttentionTime(period: string) {
    return this.orderAttendanceTimeService.getOrdersAttentionTime(period);
  }
}
