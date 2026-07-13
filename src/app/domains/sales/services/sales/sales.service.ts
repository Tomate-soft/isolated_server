import { Injectable } from '@nestjs/common';
import { CrudSalesService, Results } from './crud-sales.service';

@Injectable()
export class SalesService {
  constructor(private readonly crudSalesService: CrudSalesService) {}

  async findAll(page: number = 1, limit: number = 50): Promise<Results> {
    return this.crudSalesService.findAll(page, limit);
  }
}
