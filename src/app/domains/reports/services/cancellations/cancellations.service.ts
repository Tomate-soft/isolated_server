import { Injectable } from '@nestjs/common';
import { OrderCancellationsService } from './order-cancellations.service';
import { ProductsCancellationService } from './products-cancellation.service';

@Injectable()
export class CancellationsService {
  constructor(
    private readonly orderCancellationsService: OrderCancellationsService,
    private readonly productsCancellationService: ProductsCancellationService,
  ) {}

  async getTotalCancelsReport(period: string) {
    return this.orderCancellationsService.getTotalCancelsReport(period);
  }

  async getAuthCancellationDetailsReport(period: string) {
    return this.orderCancellationsService.getAuthCancellationDetailsReport(period);
  }
  async getCancelsOrdersByPeriod(period: string) {
    return this.orderCancellationsService.getCancelsOrdersByPeriod(period);
  }

  async getAllProductCancellationsByPeriod(period: string) {
    return this.productsCancellationService.getAllProductCancellationsByPeriod(period);
  }
}
