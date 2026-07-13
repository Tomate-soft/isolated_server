import { Injectable } from '@nestjs/common';
import { EmployeeOrdersService } from './employee-orders.service';

@Injectable()
export class OrdersService {
  constructor(private readonly employeeOrderService: EmployeeOrdersService) {}

  async getEmployeeOrdersForReport(id: string) {
    const response = this.employeeOrderService.getEmployeeOrdersForReport(id);
    return response;
  }
}
