import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { TimeService } from '../../services/time/time.service';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get('orders-attention-time/:period')
  async getOrdersAttentionTime(@Param('period') period: string) {
    try {
      const response = await this.timeService.getOrdersAttentionTime(period);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting orders attention time: ${error.message}`,
      );
    }
  }
}
