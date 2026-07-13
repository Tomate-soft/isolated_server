import { Injectable } from '@nestjs/common';
import { CrudPaymentsService } from './crudPayments.services';

@Injectable()
export class PaymentsService {
  constructor(private readonly crudPaymentsService: CrudPaymentsService) {}

  async findAll(page: number = 1, limit: number = 50): Promise<any> {
    return this.crudPaymentsService.findAll(page, limit);
  }
}
